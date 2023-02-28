const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/Final_NodeJS', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MondoDB'))
  .catch((err) => console.log('Could not connect to MongoDB...'));
