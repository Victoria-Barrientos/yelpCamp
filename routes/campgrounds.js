const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const expressError = require('../utilities/expressError');
const catchAsync = require('../utilities/catchAsync');

router.get('/home', catchAsync (campgrounds.home));

router.get('/search', catchAsync (campgrounds.findCamp));

router.get('/', catchAsync (campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync (campgrounds.createCampground));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync (campgrounds.renderEditForm));

router.get('/:id', catchAsync (campgrounds.showCampground));

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync (campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync (campgrounds.destroy));

module.exports = router;