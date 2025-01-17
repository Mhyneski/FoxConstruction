require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose')
const materialRoutes = require('./routes/materialsRoute');
const locationRoutes = require('./routes/locationsRoute');
const templatesRoutes = require('./routes/templatesRoute');
const bomRoutes = require('./routes/bomRoute');
const userRoutes = require('./routes/usersRoute');
const projectRoutes = require('./routes/projectRoute')
const {authMaterials, authTemplates, authLocations} = require('./middlewares/authMiddleware')
const cors = require('cors')

// express app
const app = express();

// middleware

app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next();
})
app.use(cors({
  origin: 'http://localhost:5173'
}));

// routes
app.use('/api/materials', authMaterials(["contractor", "admin"]), materialRoutes);
app.use('/api/locations', authLocations(["contractor", "admin"]), locationRoutes);
app.use('/api/templates', authTemplates(["contractor", "admin"]), templatesRoutes);
app.use('/api/bom', authTemplates(["contractor", "admin"]), bomRoutes);
app.use('/api/project', authTemplates(["contractor", "admin", "user"]), projectRoutes);
app.use('/api/user', userRoutes);

// connect to mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db and listening on ' + process.env.PORT);
    })
  })
  .catch((error) => {
    console.log(error)
  })

