const Campground = require('../models/campground');

module.exports.home = async (req, res) => {
    res.render('layout/home.ejs')
};

module.exports.findCamp = async (req, res) => {
    const {key, title_key, location_key, price_key }  = req.query;
    console.log(price_key)
    if ( key ) {
    let campgrounds = await Campground.find(
        {
            "$or": [
                {title: { $regex: key, $options: 'i' } },
                {location: { $regex: key, $options: 'i' } },
            ]
        }
        );
    res.render('layout/search.ejs', {campgrounds})
    } else {
        let campgrounds = await Campground.find(
            {
                "$and": [
                    {title: { $regex: title_key, $options: 'i' } },
                    {location: { $regex: location_key, $options: 'i' } },
                    {price: price_key },
                ]
            }
            );
        res.render('layout/search.ejs', {campgrounds})
    }
};

module.exports.privacyPolicy = async (req, res) => {
    res.render('layout/privacypolicy.ejs')
};

module.exports.termsAndConditions = async (req, res) => {
    res.render('layout/terms-and-conditions.ejs')
};