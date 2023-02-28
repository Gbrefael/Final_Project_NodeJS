const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/authUserModel');
const { Card, getCards, validateCards } = require('../models/cardModel');
const AuthUserModelJOI = require('../models/authUserModelJoi');
const _ = require('lodash');

// show cards under specific user
// GET http://localhost:3000/api/users/cards
router.get('/cards', auth, async (req, res) => {
  try {
    const user = req.user; // getting the user data from the middleware

    const myCards = await Card.find({ user_id: user._id });

    res.status(200).json({
      status: 'success',
      results: myCards.length,
      data: myCards,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
});

// Show personal details
// GET http://localhost:3000/api/users/me
http: router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).send(user);
  } catch (err) {
    response.status(401).send(err.message);
  }
});

// REGISTER
// POST http://localhost:3000/api/users/
router.post('/register', async (request, response) => {
  try {
    const userModel = new AuthUserModelJOI(request.body);
    const errors = userModel.validateRegistration();
    if (errors) return response.status(400).send(errors);

    let user = await User.findOne({ email: request.body.email });
    if (user) return response.status(400).send('User already registered.');

    user = new User(
      _.pick(request.body, ['username', 'email', 'password', 'biz', 'cards'])
    );

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    response.status(200).send(_.pick(user, ['_id', 'username', 'email']));
  } catch (err) {
    response.status(500).send(err.message);
  }
});

module.exports = router;
