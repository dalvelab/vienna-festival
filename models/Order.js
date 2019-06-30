const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  cart: {
    type: Object,
    required: true
  },
  delivery: {
    type: String,
    required: true
  },
  idempotenceKey: {
    type: String,
    required: true
  },  
  payment_id: {
    type: String,
    required: true
  },
  totalPrice: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  adress: {
    type: String,
    required: true
  },
  flatNumber: {
    type: Number,
    required: true
  },
  fio: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
});

module.exports = Order = mongoose.model('orders', OrderSchema);