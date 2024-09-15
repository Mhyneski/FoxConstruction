const user = require('../models/usersModel')
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');   
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
 return jwt.sign({_id: _id}, process.env.SECRET, {expiresIn: '3d'})
}

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  try {
    const USER = await user.findOne({ email });
    if (!USER) {
      return res.status(400).json({ error: 'User not found' });
    }
    // Perform password comparison
    const passwordMatch = await bcrypt.compare(password, USER.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    //create token
    const token = createToken(USER._id)

    // If authentication is successful
    res.json({ email, role: USER.role, token, id: USER._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}


// signup user
const signupUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  try {
    // Check if the email already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user with hashed password
    const USER = await user.create({ email, password: hashedPassword, role });

    //create a token
    const token = createToken(USER._id)
    
    res.status(201).json({ message: 'User created successfully', email, token});
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Server Error' });
  }
}

const deleteUser = async(req, res) => {
  const {id} = req.params

  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'id does not exist'})
  }

  try {
    const deletedUser = await user.findOneAndDelete({_id: id})
    if(!deletedUser) {
      return res.status(404).json({error: 'Material does not exist'})
    }
    res.status(200).json(deletedUser + " is deleted")
  } catch (error) {
    res.status(500).json({error: 'error occured'})
  }
}

module.exports = {
  loginUser,
  signupUser,
  deleteUser
}