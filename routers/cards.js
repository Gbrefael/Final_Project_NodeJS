const express = require('express');
const _ = require('lodash');
const {
  Card,
  validateCard,
  generateBizNumber,
} = require('../models/cardModel');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Card
// http://localhost:3000/api/cards
router.post('/', auth, async (req, res) => {
  try {
    const { errors } = validateCard(req.body);
    if (errors) return res.status(400).send(errors);

    let card = new Card({
      bizName: req.body.bizName,
      bizDescription: req.body.bizDescription,
      bizAddress: req.body.bizAddress,
      bizPhone: req.body.bizPhone,
      bizImage: req.body.bizImage
        ? req.body.bizImage
        : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      bizNumber: await generateBizNumber(Card),
      user_id: req.user._id,
    });

    post = await card.save();
    res.status(200).send(post);
  } catch (err) {
    return res.status(400).send(errors);
  }
});

// Show Single Card
// http://localhost:3000/api/cards/63f255b69907ef1e4ae1c8c6
router.get('/:id', auth, async (req, res) => {
  const card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card)
    return res.status(404).send('The card with the given ID was not found.');
  res.send(card);
});

// Update Card
// PUT http://localhost:3000/api/cards/63f89a92a603e58c54dd76a6
router.put('/:id', auth, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let card = await Card.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user._id },
    req.body
  );
  if (!card)
    return res.status(404).send('The card with the given ID was not found.');

  card = await Card.findOne({ _id: req.params.id, user_id: req.user._id });
  res.send(card);
});

//Delete Card
// DELETE http://localhost:3000/api/cards/63f89a92a603e58c54dd76a6
router.delete('/:id', auth, async (req, res) => {
  const card = await Card.findOneAndRemove({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card)
    return res.status(404).send('The card with the given ID was not found.');
  res.send(card);
});

module.exports = router;
