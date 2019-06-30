const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const YandexCheckout = require('yandex-checkout')({shopId: '601734', secretKey: 'live_cZL8TN-trfms9wQpUvi5vZ1Av-obz7wCFpJHMvAGGGg'});
const uuidv4 = require('uuid/v4');
const {ensureGuest} = require('../helpers/auth');

// Load Shop Model
require('../models/Item');
const Item = mongoose.model('items');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const User = require('../models/User');

router.get('/', async (req, res)  => {
  let items = await Item.find()
  await res.render('shop/shop', {
    items: items
  }) 
});

// @route   GET shop/cart
// @desc    Return cart 
// @access  Public
router.get('/cart', async(req, res, next) => {
  if (!req.session.cart) {
    return await res.render('shop/cart', {products: null});
  }
  let cart = await new Cart(req.session.cart);
  await res.render('shop/cart', {
    items: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty
  });
});

// @route   GET shop/cart/remove/:id
// @desc    Return current user 
// @access  Public
router.get('/cart/remove/:id/:size', async(req, res) => {
  const productId = await req.params.id;
  const productSize = await req.params.size;
  let cart = await new Cart(req.session.cart);
  cart.removeItem(productId, productSize);
  req.session.cart = await cart;
  await res.redirect('/shop/cart');  
});

// @route   GET shop/checkout
// @desc    Return current user 
// @access  Public
router.get('/checkout', ensureGuest, async(req, res) => {
  if (!req.session.cart) {
    return await res.render('shop/cart', {products: null});
  }
  let cart = await new Cart(req.session.cart);
  await res.render('shop/checkout', {
    total: cart.totalPrice
  });
});

router.post('/payment', ensureGuest, async (req, res) => {
  const user = await User.findOne({_id: req.user.id});
  let totalPrice = req.body.totalPriceHidden;
  let cart = await new Cart(req.session.cart);
  const idempotenceKey = uuidv4();

  YandexCheckout.createPayment({    
    'amount': {
      'value': `${totalPrice}`,
      'currency': 'RUB'
    },
    'confirmation': {
      'type': 'redirect',
      'return_url': 'http://vmff.ru/users/orders'
    },
    'capture': 'true',
    'description': `${idempotenceKey}`
  }, idempotenceKey)
    .then(function(result) {
      payment_id = result.id;
      const newOrder = {
        cart: cart,
        delivery: req.body.delivery,
        idempotenceKey: idempotenceKey,
        totalPrice: totalPrice,
        payment_id: payment_id,
        region: req.body.region,
        city: req.body.city,
        adress: req.body.adress,
        flatNumber: req.body.flatNumber,
        fio: req.body.fio,
        phone: req.body.phone,
        email: req.body.email,
        user: req.user.id
      }
    
      new Order(newOrder).save().then(order => {
        console.log(user.orders);
        console.log(order);
        user.orders.unshift(order.id);
        user.save()    
      });
      res.redirect(result.confirmation.confirmation_url);
    })
    .catch(function(err) {
      console.error(err);
    });
});

module.exports = router;