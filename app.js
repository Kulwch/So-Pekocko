/**
 * app.js
 * Applications settings
 * Imports necessary plugins first, like @mongoose (error handling for mongodb) or @helmet (prevents from arbitrary code injections).
 * Estalishes the connection between the database and the application.
 * Sets which routes and models are to be used. 
 * Provides with the headers for each request that will be made to the API.
 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const User = require('./models/User');
const Sauce = require('./models/Sauce');

mongoose.connect('mongodb+srv://Kulwch:JuDeSo858618!@cluster0.7hkp3.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;