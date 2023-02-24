const express = require('express');
const router = express.Router();
const yelpcamp = require('../controllers/yelpcamp');

const expressError = require('../utilities/expressError');
const catchAsync = require('../utilities/catchAsync');

router.get('/home', catchAsync (yelpcamp.home));

router.get('/search', catchAsync (yelpcamp.findCamp));

router.get('/privacypolicy', catchAsync(yelpcamp.privacyPolicy))

module.exports = router;