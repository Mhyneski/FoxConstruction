const express = require('express')
const { getProjectForUser,createProject, getProject, getProjectById, updateProject, deleteProject, updateFloorProgress } = require('../controllers/projectController');
const {authMiddleware} = require('../middlewares/authMiddleware')

const router = express.Router();

router.use(authMiddleware);

// Get all projects
router.get('/', getProject);

// get all project of user
router.get('/projectuser', getProjectForUser)

// Get specific project by ID
router.get('/:id', getProjectById);

// Create a new project
router.post('/', createProject);

// Delete a project
router.delete('/:id', deleteProject);

// Update a project
router.patch('/:id', updateProject);

// Update floor progress
router.patch('/:projectId/floors/:floorId', updateFloorProgress);

module.exports = router