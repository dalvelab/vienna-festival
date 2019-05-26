const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Pages');
const Welcome = mongoose.model('welcomes');

const asyncMiddleware = require('../helpers/asyncMiddleware');

router.get('/', asyncMiddleware(async (req, res)  => {
  Welcome.find()
    .then(welcome => {
      res.render('welcome/index', {
        welcome: welcome
      });
    });
}));

module.exports = router;