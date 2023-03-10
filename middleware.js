const expressError = require('./utilities/expressError');
const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require('./models/user');
const {campgroundValSchema, reviewValSchema, userValSchema} = require('./validationSchemas.js');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first.');
        return res.redirect('/login');
    }
    next();
};

module.exports.isLoggedOut = (req, res, next) => {
    if(req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You cannot register another user while logged in.');
        return res.redirect('/campgrounds');
    }
    next();
};

module.exports.checkReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
    }
    next();
};


module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundValSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        req.flash('error', `Invalid data, try again please. ERROR 400 - DETAILS [${msg}]`);
        return res.redirect('/campgrounds/new')
        // throw new expressError(msg, 400)
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { id } = req.params;
    const {error} = reviewValSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        req.flash('error', `Invalid data, try again please. ${msg}` );
        // throw new expressError(msg, 400)
        return res.redirect(`/campgrounds/${id}`)
    } else {
        next();
    }
};

module.exports.validateUser = (req, res, next) => {
    const { error } = userValSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        req.flash('error', `Invalid data, try again please. ${msg}` );
        // throw new expressError(msg, 400)
        return res.redirect(`/register`);
    } else {
        next();
    }
};

module.exports.isCurrentUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if(!req.user || !user._id.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/users/${id}`);
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/campgrounds/${id}`);
    }
    next();
};