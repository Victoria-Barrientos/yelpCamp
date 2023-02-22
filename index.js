if (process.env.NODE_ENV !=='production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const expressError = require('./utilities/expressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const Joi = require('joi');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const yelpcampRoutes = require('./routes/yelpcamp');
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const MongoDBStore = require('connect-mongo');

const { MongoClient, ServerApiVersion } = require('mongodb');
// const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelpCamp';
const dbUrl = 'mongodb://127.0.0.1:27017/yelpCamp';

try {
    mongoose.connect(dbUrl, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1 })
        
    console.log('MONGO CONNECTION OPEN');
  } catch (error) {
console.log('UPS, MONGO CONNECTION ERROR')
console.error(error);
}

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended:true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());

const secret =  process.env.SECRET || 'bestsecretever';

const store = MongoDBStore.create ({
    mongoUrl: dbUrl, 
    secret,
    touchAfter: 24 * 3600
});

store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    } 
}
app.use(session(sessionConfig));
app.use(flash());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://res.cloudinary.com/dwntaafwj/",
];
const styleSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://res.cloudinary.com/dwntaafwj/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://res.cloudinary.com/dwntaafwj/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dwntaafwj/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
    usernameField: 'user[username]',
    passwordField: 'user[password]'
  }, 
  User.authenticate()
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)  => {

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.listen (3000, () => {
    console.log('Serving at port 3000')
});

app.use('/', userRoutes);
app.use('/', yelpcampRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', {err});
})

