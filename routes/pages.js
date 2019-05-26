const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Pages');
const Children = mongoose.model('childrens');
const Restaraunt = mongoose.model('restaraunts');

router.get('/restaurant', (req, res) => {
  Restaraunt.find()
  .then(restaraunt => {
    res.render('pages/restaraunt', {
      restaraunt: restaraunt
    });
  })
});

router.get('/children', (req, res) => {
  Children.find()
  .then(children => {
    res.render('pages/children', {
      children: children
    });
  })  
});

router.get('/about', (req, res) => {
  res.render('pages/about')
});

module.exports = router;