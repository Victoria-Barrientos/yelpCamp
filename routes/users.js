const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const { checkReturnTo, validateUser, isLoggedIn, isLoggedOut, isCurrentUser } = require('../middleware.js');
const users = require('../controllers/users');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/register', isLoggedOut, users.renderRegister);

router.post('/register', validateUser, catchAsync (users.register)); 

router.get('/users/:id/settings', isCurrentUser, isLoggedIn, catchAsync(users.renderSettingsForm));

router.get('/users/:id', catchAsync(users.renderProfile));

router.put('/users/:id', isLoggedIn, upload.single('user[profile_picture]'), isCurrentUser, catchAsync(users.updateProfile));

router.get('/login', users.renderLogin);

router.post('/login', checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login )

router.get('/logout', users.logout);

router.delete('/users/:id/settings', isLoggedIn, isCurrentUser, catchAsync (users.destroy));

module.exports = router;
