const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
// Load Orders Model
const Day = require('../models/Day');

router.get('/', async (req, res)  => {
  const days = await Day.find().sort({day: 1});
  await res.render('program/index', {
    days: days
  });
});

router.get('/:day', async(req, res) => {
  const day = await Day.findOne({day: req.params.day});
  await res.render('program/single', {
    day: day
  });
});

router.get('/pdf/:id', async(req, res) =>  {
  const day = await Day.findOne({_id: req.params.id});

  var doc = new PDFDocument();

  // draw some text
  doc.fontSize(25).text(`${day.title}`, {
    align: 'center'
  });

  doc.circle(280, 200, 50).fill('#6600FF');

  doc.pipe(res);  
  doc.end();
})

module.exports = router;