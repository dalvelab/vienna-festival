const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const {validationResult, check} = require('express-validator/check');
const {ensureAdmin, ensureGuest} = require('../helpers/auth');

// Load User Model
const User = require('../models/User');

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
  check('name', 'Имя обязательно')
    .not()
    .isEmpty(),
  check('email', 'Введите валидный email')
    .isEmail(),
  check('password', 'Пароль должен содержать минимум 6 символов').isLength({min: 6})
], 
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.render('auth/index', {errors: errors.array()});
  }

  const {name, email, password} = req.body;

  try {
    let user = await User.findOne({email});
    if(user)  {
      return res.render('auth/index', {errors: [{msg: 'Пользователь уже зарегистрирован'}]});
    }

    user = new User({
      name, email, password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    await res.redirect('/users/auth');

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /users/login
// @desc    Login Users / Returning the token
// @access  Public
router.post('/login', (req, res, next ) => {
  passport.authenticate('local', {
    successRedirect: '/users/current',
    failureRedirect: '/auth/login',
  })(req, res, next);
});

// @route   GET /users/current
// @desc    Return current user 
// @access  Private
router.get('/current', ensureGuest, async(req, res) => {
  try {
    const user = await User.findOne({_id: req.user.id});
    await res.render('profile/dashboard', {
      user: user
    });
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /users/logout
// @desc    Return current user 
// @access  Public
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/users/auth');
 });

module.exports = router;