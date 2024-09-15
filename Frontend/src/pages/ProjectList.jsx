import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import styles from "../css/ProjectList.module.css";
import { AuthContext } from "../context/AuthContext";
 
const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    contractor: "",
    user: "",
    floors: [{ name: "", progress: 0, tasks: [{ name: "", progress: 0 }] }],
    tier: "",
  });
  const [updateProject, setUpdateProject] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/project", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [user]);

  const handleCreateProject = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/project",
        {
          name: newProject.name,
          contractor: newProject.contractor,
          user: newProject.user,
          floors: newProject.floors.map((floor) => ({
            name: floor.name,
            progress: floor.progress,
            tasks: floor.tasks.map((task) => ({
              name: task.name,
              progress: task.progress,
            })),
          })),
          tier: newProject.tier,  // Corrected this line
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
  
      setProjects([...projects, response.data.data]);
  
      setNewProject({
        name: "",
        contractor: "",
        user: "",
        floors: [{ name: "", progress: 0, tasks: [{ name: "", progress: 0 }] }],
        tier: "",
      });
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleUpdateProject = async (id) => {
    try {
      console.log("Sending update request with data:", updateProject);
      const response = await axios.patch(
        `http://localhost:4000/api/project/${id}`,
        updateProject,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Update response:", response.data);
      setProjects(
        projects.map((project) =>
          project._id === id ? response.data : project
        )
      );

      setUpdateProject(null);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/project/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setProjects(projects.filter((project) => project._id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="project-list-container">
        <h1>All Projects</h1>
        <div className={styles.projectForm}>
          <h2>Create New Project</h2>
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Contractor Email"
            value={newProject.contractor}
            onChange={(e) =>
              setNewProject({ ...newProject, contractor: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="User Email"
            value={newProject.user}
            onChange={(e) =>
              setNewProject({ ...newProject, user: e.target.value })
            }
          />

          <h3>Floors</h3>
          {newProject.floors.map((floor, floorIndex) => (
            <div key={floorIndex} className={styles.floorContainer}>
              <h4>Floor {floorIndex + 1}</h4>
              <input
                type="text"
                placeholder="Floor Name"
                value={floor.name}
                onChange={(e) => {
                  const updatedFloors = newProject.floors.map((f, i) =>
                    i === floorIndex ? { ...f, name: e.target.value } : f
                  );
                  setNewProject({ ...newProject, floors: updatedFloors });
                }}
              />
              <input
                type="number"
                placeholder="Floor Progress"
                value={floor.progress}
                onChange={(e) => {
                  const progressValue = parseInt(e.target.value, 10);
                  const updatedFloors = newProject.floors.map((f, i) =>
                    i === floorIndex ? { ...f, progress: progressValue } : f
                  );
                  setNewProject({ ...newProject, floors: updatedFloors });
                }}
              />

              <h5>Tasks</h5>
              {floor.tasks.map((task, taskIndex) => (
                <div key={taskIndex} className={styles.taskContainer}>
                  <input
                    type="text"
                    placeholder="Task Name"
                    value={task.name}
                    onChange={(e) => {
                      const updatedTasks = floor.tasks.map((t, i) =>
                        i === taskIndex ? { ...t, name: e.target.value } : t
                      );
                      const updatedFloors = newProject.floors.map((f, i) =>
                        i === floorIndex ? { ...f, tasks: updatedTasks } : f
                      );
                      setNewProject({ ...newProject, floors: updatedFloors });
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Task Progress"
                    value={task.progress}
                    onChange={(e) => {
                      const progressValue = parseInt(e.target.value, 10);
                      const updatedTasks = floor.tasks.map((t, i) =>
                        i === taskIndex ? { ...t, progress: progressValue } : t
                      );
                      const updatedFloors = newProject.floors.map((f, i) =>
                        i === floorIndex ? { ...f, tasks: updatedTasks } : f
                      );
                      setNewProject({ ...newProject, floors: updatedFloors });
                    }}
                  />
                  <button
                    onClick={() => {
                      const updatedTasks = floor.tasks.filter(
                        (t, i) => i !== taskIndex
                      );
                      const updatedFloors = newProject.floors.map((f, i) =>
                        i === floorIndex ? { ...f, tasks: updatedTasks } : f
                      );
                      setNewProject({ ...newProject, floors: updatedFloors });
                    }}
                  >
                    Delete Task
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const updatedTasks = [
                    ...floor.tasks,
                    { name: "", progress: 0 },
                  ];
                  const updatedFloors = newProject.floors.map((f, i) =>
                    i === floorIndex ? { ...f, tasks: updatedTasks } : f
                  );
                  setNewProject({ ...newProject, floors: updatedFloors });
                }}
              >
                Add Task
              </button>
              <button
                onClick={() => {
                  const updatedFloors = newProject.floors.filter(
                    (f, i) => i !== floorIndex
                  );
                  setNewProject({ ...newProject, floors: updatedFloors });
                }}
              >
                Delete Floor
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setNewProject({
                ...newProject,
                floors: [
                  ...newProject.floors,
                  { name: "", progress: 0, tasks: [{ name: "", progress: 0 }] },
                ],
              })
            }
          >
            Add Floor
          </button>

          <select
  value={newProject.tier}
  onChange={(e) => setNewProject({ ...newProject, tier: e.target.value })}
>
  <option value="" disabled>Select Template Tier</option>
  <option value="low">Low</option>
  <option value="mid">Mid</option>
  <option value="high">High</option>
</select>
          <button onClick={handleCreateProject}>Create Project</button>
        </div>
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <ul className={styles.projectList}>
            {projects.map((project) => (
              <li key={project._id} className={styles.projectItem}>
                {updateProject && updateProject._id === project._id ? (
                  <div className={styles.projectEditForm}>
                    <h3>Edit Project</h3>
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={updateProject.name}
                      onChange={(e) =>
                        setUpdateProject({
                          ...updateProject,
                          name: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Contractor Email"
                      value={updateProject.contractor}
                      onChange={(e) =>
                        setUpdateProject({
                          ...updateProject,
                          contractor: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="User Email"
                      value={updateProject.user}
                      onChange={(e) =>
                        setUpdateProject({
                          ...updateProject,
                          user: e.target.value,
                        })
                      }
                    />

                    <h4>Floors</h4>
                    {updateProject.floors.map((floor, floorIndex) => (
                      <div key={floorIndex} className={styles.floorEdit}>
                        <input
                          type="text"
                          placeholder="Floor Name"
                          value={floor.name}
                          onChange={(e) => {
                            const updatedFloors = updateProject.floors.map(
                              (f, i) =>
                                i === floorIndex
                                  ? { ...f, name: e.target.value }
                                  : f
                            );
                            setUpdateProject({
                              ...updateProject,
                              floors: updatedFloors,
                            });
                          }}
                        />
                        <input
                          type="number"
                          placeholder="Floor Progress"
                          value={floor.progress}
                          onChange={(e) => {
                            const updatedFloors = updateProject.floors.map(
                              (f, i) =>
                                i === floorIndex
                                  ? {
                                      ...f,
                                      progress: parseInt(e.target.value, 10),
                                    }
                                  : f
                            );
                            setUpdateProject({
                              ...updateProject,
                              floors: updatedFloors,
                            });
                          }}
                        />
                        <h5>Tasks</h5>
                        {floor.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className={styles.taskEdit}>
                            <input
                              type="text"
                              placeholder="Task Name"
                              value={task.name}
                              onChange={(e) => {
                                const updatedTasks = floor.tasks.map((t, i) =>
                                  i === taskIndex
                                    ? { ...t, name: e.target.value }
                                    : t
                                );
                                const updatedFloors = updateProject.floors.map(
                                  (f, i) =>
                                    i === floorIndex
                                      ? { ...f, tasks: updatedTasks }
                                      : f
                                );
                                setUpdateProject({
                                  ...updateProject,
                                  floors: updatedFloors,
                                });
                              }}
                            />
                            <input
                              type="number"
                              placeholder="Task Progress"
                              value={task.progress}
                              onChange={(e) => {
                                const updatedTasks = floor.tasks.map((t, i) =>
                                  i === taskIndex
                                    ? {
                                        ...t,
                                        progress: parseInt(e.target.value, 10),
                                      }
                                    : t
                                );
                                const updatedFloors = updateProject.floors.map(
                                  (f, i) =>
                                    i === floorIndex
                                      ? { ...f, tasks: updatedTasks }
                                      : f
                                );
                                setUpdateProject({
                                  ...updateProject,
                                  floors: updatedFloors,
                                });
                              }}
                            />
                            <button
                            className={styles.Projectbutton}
                              onClick={() => {
                                const updatedTasks = floor.tasks.filter(
                                  (t, i) => i !== taskIndex
                                );
                                const updatedFloors = updateProject.floors.map(
                                  (f, i) =>
                                    i === floorIndex
                                      ? { ...f, tasks: updatedTasks }
                                      : f
                                );
                                setUpdateProject({
                                  ...updateProject,
                                  floors: updatedFloors,
                                });
                              }}
                            >
                              Delete Task
                            </button>
                          </div>
                        ))}
                        <button
                        className={styles.Projectbutton}
                          onClick={() => {
                            const updatedTasks = [
                              ...floor.tasks,
                              { name: "", progress: 0 },
                            ];
                            const updatedFloors = updateProject.floors.map(
                              (f, i) =>
                                i === floorIndex
                                  ? { ...f, tasks: updatedTasks }
                                  : f
                            );
                            setUpdateProject({
                              ...updateProject,
                              floors: updatedFloors,
                            });
                          }}
                        >
                          Add Task
                        </button>
                        <button
                        className={styles.Projectbutton}
                          onClick={() => {
                            const updatedFloors = updateProject.floors.filter(
                              (f, i) => i !== floorIndex
                            );
                            setUpdateProject({
                              ...updateProject,
                              floors: updatedFloors,
                            });
                          }}
                        >
                          Delete Floor
                        </button>
                      </div>
                    ))}
                    <button
                    className={styles.Projectbutton}
                      onClick={() => {
                        const newFloor = {
                          name: "New Floor",
                          progress: 0,
                          tasks: [{ name: "New Task", progress: 0 }]
                        };
                        const updatedFloors = [...updateProject.floors, newFloor];
                        setUpdateProject({
                          ...updateProject,
                          floors: updatedFloors,
                        });
                      }}
                    >
                      Add Floor
                    </button>

                    <div className={styles.editActions}>
                      <button className={styles.Projectbutton} onClick={() => handleUpdateProject(project._id)}>
                        Update
                      </button>
                      <button className={styles.Projectbutton} onClick={() => setUpdateProject(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.projectDisplay}>
                    <h3>{project.name}</h3>
                    <p>
                      <strong>Contractor:</strong>{" "}
                      {project.contractor || "No contractor email"}
                    </p>
                    <p>
                      <strong>Project owner:</strong>{" "}
                      {project.user || "No user email"}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(project.createdAt).toLocaleString()}
                    </p>
                    <h4>Floors</h4>
                    {project.floors.map((floor, index) => (
                      <div key={index} className={styles.floorDisplay}>
                        <h5>
                          {floor.name} - Progress: {floor.progress}%
                        </h5>
                        <ul>
                          {floor.tasks.map((task, taskIndex) => (
                            <li key={taskIndex}>
                              {task.name} - Progress: {task.progress}%
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className={styles.projectActions}>
                      <button className={styles.Projectbutton} onClick={() => setUpdateProject(project)}>
                        Edit
                      </button>
                      <button className={styles.Projectbutton} onClick={() => handleDeleteProject(project._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ProjectList;
