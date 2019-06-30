const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  title: {
    type: String
  },
  price: {
    type: Number
  },
  image: {
    type: String
  },
  size: {
    type: Object
  },
  thesis: {
    type: String
  }
});

module.exports = Item = mongoose.model('items', ItemSchema);