const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding ({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.home = async (req, res) => {
    res.render('campgrounds/home.ejs')
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
    res.render('campgrounds/search.ejs', {campgrounds})
};


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render ('campgrounds/index.ejs', {campgrounds})
};

module.exports.renderNewForm = (req,res) => {
    res.render ('campgrounds/new.ejs')
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode ({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f =>({ url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`)

};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render ('campgrounds/edit.ejs', {campground})
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate({ path: 'author' });
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    console.log(campground);
    res.render ('campgrounds/show.ejs', {campground})
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators: true, new: true});
    const imgs = req.files.map(f =>({ url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages}}}})
    console.log(campground);
    };
    req.flash('success', 'Successfully updated campground!');
    res.redirect (`/campgrounds/${campground._id}`)
}

module.exports.destroy = async (req, res) => {
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}