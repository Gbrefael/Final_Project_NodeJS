const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const AuthUserModelJOI = require('../models/authUserModelJoi');
const AuthUserModel = require('../models/authUserModel');
const _ = require('lodash');

// LOGIN
// POST http://localhost:3000/api/auth/
router.post('/login', async (request, response) => {
  try {
    const userModel = new AuthUserModelJOI(request.body);
    const errors = userModel.validateLogin();
    if (errors) return response.status(400).send(errors);

    const user = await AuthUserModel.findOne({ email: request.body.email });
    if (!user) return response.status(400).json({ email: 'Invalid email.' });

    const password = await bcrypt.compare(request.body.password, user.password);
    if (!password) return response.status(400).send('Invalid password.');

    response.status(200).json({ token: user.generateAuthToken() });
  } catch (err) {
    response.status(500).send(err.message);
  }
});

module.exports = router;
