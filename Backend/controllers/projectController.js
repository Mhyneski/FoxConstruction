const { default: mongoose } = require('mongoose');
const Project = require('../models/projectModel');
const User = require('../models/usersModel');

const createProject = async (req, res) => {
  const { name, contractor: contractorEmail, user: userEmail, floors, tier } = req.body; // Changed `template` to `tier`

  try {
    // Fetch the contractor and user from the database by their emails
    const contractorObject = await User.findOne({ email: contractorEmail });
    const userObject = await User.findOne({ email: userEmail });

    // Check if the contractor exists and is a contractor
    if (!contractorObject || contractorObject.role !== 'contractor') {
      return res.status(403).json({ error: "The provided contractor is invalid or not a contractor." });
    }

    // Check if the user exists
    if (!userObject) {
      return res.status(404).json({ error: "The provided user does not exist." });
    }

    // Validate the tier (although it's not strictly necessary as Mongoose will validate against the schema)
    if (!["low", "mid", "high"].includes(tier)) {
      return res.status(400).json({ error: `Invalid tier: ${tier}. Must be 'low', 'mid', or 'high'.` });
    }

    // Ensure that floors data is in the correct format
    const formattedFloors = floors.map(floor => ({
      name: floor.name,
      progress: floor.progress || 0, // Ensure progress is defaulted if not provided
      tasks: floor.tasks.map(task => ({
        name: task.name,
        progress: task.progress || 0 // Ensure progress is defaulted if not provided
      }))
    }));

    // Create the project with the provided tier directly
    const project = await Project.create({
      name,
      contractor: contractorObject.email, // Use the contractor's email
      user: userObject.email, // Use the user's email
      floors: formattedFloors,
      tier: tier 
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ error: "Failed to create project.", details: error.message });
  }
};


module.exports = { createProject };



// get all projects
const getProject = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update floor progress in a project
const updateFloorProgress = async (req, res) => {
  const { progress } = req.body;
  if (progress < 0 || progress > 100) {
    return res.status(400).json({ message: 'Progress must be between 0 and 100' });
  }

  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const floor = project.floors.id(req.params.floorId);
    if (!floor) {
      return res.status(404).json({ message: 'Floor not found' });
    }

    floor.progress = progress;
    await project.save();
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('contractor user template').exec();
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all projects for the logged-in user
const getProjectForUser = async (req, res) => {
  try {
    const email = req.user.email; // Assuming the user's ID is available in req.user
    const projects = await Project.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("Received update data:", updateData);

    // Find the project by ID
    const project = await Project.findById(id);
    if (!project) {
      console.log("Project not found");
      return res.status(404).json({ message: 'Project not found' });
    }

    // Handle updating floors
    if (updateData.floors) {
      updateData.floors.forEach(newFloor => {
        const existingFloor = project.floors.id(newFloor._id);
        if (existingFloor) {
          // Update existing floor
          console.log("Updating existing floor:", newFloor);
          existingFloor.name = newFloor.name;
          existingFloor.progress = newFloor.progress;

          newFloor.tasks.forEach(newTask => {
            const existingTask = existingFloor.tasks.id(newTask._id);
            if (existingTask) {
              // Update existing task
              console.log(`Updating task ${newTask.name} progress to ${newTask.progress}`);
              existingTask.name = newTask.name;
              existingTask.progress = newTask.progress;
            } else {
              // Add new task
              console.log(`Adding new task ${newTask.name} with progress ${newTask.progress}`);
              existingFloor.tasks.push({ name: newTask.name, progress: newTask.progress });
            }
          });
        } else {
          // Add new floor
          console.log("Adding new floor:", newFloor);
          project.floors.push({
            name: newFloor.name,
            progress: newFloor.progress,
            tasks: newFloor.tasks.map(task => ({
              name: task.name,
              progress: task.progress
            }))
          });
        }
      });
      delete updateData.floors;
    }

    // Update other fields
    for (const key in updateData) {
      console.log(`Updating field ${key} to ${updateData[key]}`);
      project[key] = updateData[key];
    }

    await project.save();
    res.status(200).json(project);
  } catch (error) {
    console.error("Error in updateProject:", error);
    res.status(500).json({ error: "Failed to update project.", details: error.message });
  }
};



// Delete a project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getProject,
  getProjectById,
  updateProject,
  deleteProject,
  updateFloorProgress,
  getProjectForUser
};