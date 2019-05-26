const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Album Model
require('../models/Album');
const Album = mongoose.model('albums');

router.get('/', (req, res) => {
  Album.find()
  .then(albums => {
    res.render('albums/all', {
      albums: albums
    });
  });  
});

router.get('/:year', (req, res) => {
  Album.findOne({
    year: req.params.year
  })
  .then(album => {
    res.render('albums/single', {
      album: album
    })
  });
});

module.exports = router;