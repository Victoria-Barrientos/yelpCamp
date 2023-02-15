const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const { checkReturnTo, validateUser } = require('../middleware.js');
const users = require('../controllers/users');

router.get('/register', users.renderRegister);

router.post('/register', validateUser, catchAsync (users.register)); 

router.get('/login', users.renderLogin);

router.post('/login', checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login )

router.get('/logout', users.logout)

module.exports = router;
