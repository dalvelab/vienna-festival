const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');
const {validationResult, check} = require('express-validator/check');
const YandexCheckout = require('yandex-checkout')({shopId: '601734', secretKey: 'live_cZL8TN-trfms9wQpUvi5vZ1Av-obz7wCFpJHMvAGGGg'});
const {ensureGuest} = require('../helpers/auth');

// Load User Model
const User = require('../models/User');
const Cart = require('../models/Cart');
const Day = require('../models/Day');
const Item = require('../models/Item')
const Order = require('../models/Order')

// @route   GET /users/auth
// @desc    Tests users route
// @access  Public
router.get('/auth', (req, res) => {
  res.render('auth/index')
});

// @route   POST /users/register
// @desc    Register User
// @access  Public
router.post('/register', [
  check('name', 'Поле Имя обязательно')
  .not()
  .isEmpty(), 
  check('email', 'Введите валидный email')
    .isEmail(),
  check('password', 'Длина пароля должна быть не менее 6 символов')
    .isLength({min: 6})
], 
async (req, res) => {
  const errors = validationResult(req);
  const errors_array = errors.array();
  if(!errors.isEmpty()) {
    res.render('auth/index', {
      error_msg: errors_array
    })
  }
  const {name, email, password} = req.body;

  try {
    let user = await User.findOne({email});
    if(user)  {
      return res.render('auth/index', {error_msg: [{msg: 'Пользователь уже зарегистрирован'}]});
    }

    user = new User({
      name, email, password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    await res.render('auth/index', {success_msg: [{msg: 'Вы зарегистрированы и можете войти'}]});

  } catch(err) {
    
  }
});

// @route   POST /users/login
// @desc    Login Users / Returning the token
// @access  Public
router.post('/login', (req, res, next ) => {
  passport.authenticate('local', {
    successRedirect: '/users/current',
    failureRedirect: '/users/auth',
    failureFlash: true  
  })(req, res, next);
});

// @route   GET /users/current
// @desc    Return current user 
// @access  Private
router.get('/current', ensureGuest, async(req, res) => {
  try {
    const user = await User.findOne({_id: req.user.id}).populate({path: 'program', options: {sort: {day: 1}}})
    await res.render('profile/dashboard', {
      user: user
    });
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/orders', ensureGuest, async(req, res) => {
  try {
    const user = await User.findOne({_id: req.user.id}).populate('orders');
    await res.render('profile/orders', {
      user: user
    });
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/order/:id', ensureGuest, async(req, res) => {
  const order = await Order.findOne({_id: req.params.id}).populate('user');
  const paymentId = order.payment_id;
  const idempotenceKey = order.idempotenceKey;

  YandexCheckout.getPayment(paymentId, idempotenceKey)
  .then((result) => {
    res.render('profile/single-order', {
      order: order,
      payment: result
    });
  })
  .catch(function(err) {
    console.error(err);
  });
});

// @route   GET /users/logout
// @desc    Return current user 
// @access  Public
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/users/auth');
 });

// @route   POST /users/cart/:id
// @desc    Return current user 
// @access  Public
router.post('/cart/:id/:size', async(req, res) => {
  try {
    const productId = req.params.id;
    const productSize = req.params.size;
    let cart = await new Cart(req.session.cart ? req.session.cart : {});  
    const product = await Item.findById(productId);
    await cart.add(product, productId, productSize);
    req.session.cart = await cart;
    await res.redirect('/shop');
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /users/current/myprogram/:id
// @desc    Return current user 
// @access  Private
router.post('/current/myprogram/:id', ensureGuest, async(req, res) => {
  const user = await User.findOne({_id: req.user.id});
  const day = await Day.findOne({_id: req.params.id});
  
  await user.program.unshift(day);
  await user.save()
  await res.redirect('/program');
});


module.exports = router;