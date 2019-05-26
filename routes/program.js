const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const asyncMiddleware = require('../helpers/asyncMiddleware');

// Load Orders Model
require('../models/Day');
const Day = mongoose.model('day');

router.get('/', asyncMiddleware(async (req, res)  => {
  Day.find()
    .then(days => {
      res.render('program/index', {
        days: days
      });
    });
}));

router.get('/:day', asyncMiddleware(async(req, res) => {
  Day.findOne({
    day: req.params.day
  })
  .then(day => {
    res.render('program/single', {
      day
    })
  });
}));

module.exports = router;