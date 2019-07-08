const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DaySchema = new Schema({
      title: {
        type: String,
        required: true
      },
      day: {
        type: Number,
        required: true
      },
      month: {
        type: String,
        required: true
      },
      week_day: {
        type: String
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
      isChildren: {
        type: Boolean,
        default: false
      },
      description: {
        type: String,
        required: true
      },
      startDay: {
        type: String
      }
});

module.exports = Day = mongoose.model('day', DaySchema, 'days');