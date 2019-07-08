const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Pages');
const Welcome = mongoose.model('welcomes');
const Day = require('../models/Day');

router.get('/', async(req, res)  => {
  const welcome = await Welcome.find();
  res.render('welcome/index', {
    welcome: welcome
  }); 
});

router.get('/currentday/:startDay', async(req, res) => {
  const day = await Day.findOne({startDay: req.params.startDay});
  await res.json(day);
});

module.exports = router;