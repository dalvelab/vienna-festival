const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  images: [{
    type: Object 
  }]
});

module.exports = Album = mongoose.model('albums', AlbumSchema);