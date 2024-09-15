const express = require('express')
const {loginUser, signupUser, deleteUser} = require('../controllers/userController')

const router = express.Router();

// login route 
router.post('/login', loginUser)

// sign-up route
router.post('/signup', signupUser)

// delete user
router.delete('/:id', deleteUser)

module.exports = router