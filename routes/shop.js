const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const asyncMiddleware = require('../helpers/asyncMiddleware');

// Load Shop Model

router.get('/', asyncMiddleware(async (req, res)  => {
  res.render('shop/shop')
}));

module.exports = router;