const Campground = require('../models/campground');

module.exports.home = async (req, res) => {
    res.render('layout/home.ejs')
};

module.exports.findCamp = async (req, res) => {
    const { key }  = req.query;
    let campgrounds = await Campground.find(
        {
            "$or": [
                {title: { $regex: key, $options: 'i' } },
                {location: { $regex: key, $options: 'i' } },
                
            ]
        }
        );
    res.render('layout/search.ejs', {campgrounds})
};

module.exports.privacyPolicy = async (req, res) => {
    res.render('layout/privacypolicy.ejs')
};