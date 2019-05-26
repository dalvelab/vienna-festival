const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DaySchema = new Schema({
      title: {
        type: String,
        required: true
      },
      day: {
        type: String,
        required: true
      },
      month: {
        type: String,
        required: true
      },
      number: {
        type: String,
        required: true
      },
      time: {
        type: String,
        required: true
      },
      place: {
        type: String,
        required: true
      },
      image: {
        type: String
      },
      thesis: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
});

module.exports = Day = mongoose.model('day', DaySchema, 'days');