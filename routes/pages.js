const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Pages');
const Children = mongoose.model('childrens');
const Restaraunt = mongoose.model('restaraunts');
const Day = mongoose.model('day');

router.get('/restaurant', (req, res) => {
  Restaraunt.find()
  .then(restaraunt => {
    res.render('pages/restaraunt', {
      restaraunt: restaraunt
    });
  })
});

router.get('/children', async(req, res) => {
  const day = await Day.find().sort({day: 1});
  const children = await Children.find();

  await res.render('pages/children', {
    day: day,
    children: children
  })
});

router.get('/about', (req, res) => {
  res.render('pages/about')
});

module.exports = router;