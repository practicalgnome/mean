const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

const app = express();

mongoose.connect('mongodb+srv://practicalgnome:6ghQja3MWdiqt7dp@cluster0-vt9dh.mongodb.net/mean?retryWrites=true&w=majority')
  .then(() => {
    console.log('=== connected to db!');
  })
  .catch(() => {
    console.log('=== connection failure');
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postsRoutes);

module.exports = app;
