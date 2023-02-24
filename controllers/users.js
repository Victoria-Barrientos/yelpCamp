const User = require('../models/user');
const Campground = require('../models/campground');

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
};

module.exports.register = async(req, res, next) => {
    try{
        const { first_name, last_name, username, email, birth_date, password, repeat_password } = req.body.user;
        console.log(req.body.user);
        const user = new User ({first_name, last_name, email, birth_date, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = (req,res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', `Welcome back, ${req.body.user.username}`);
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
    })
    req.flash('success', 'See you later, alligator!');
    res.redirect('/home');
};

module.exports.renderProfile = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.find({});
    const user = await User.findById(id);
    res.render('users/profile.ejs', {user, campgrounds});
  };

module.exports.renderSettingsForm = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render('users/settings.ejs', {user});
  };
  
module.exports.updateProfile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, {...req.body.user}, 
        {runValidators: true, new: true});
    if (req.file) {
            const { path, filename } = req.file;
            user.profile_picture = { url: path, filename };
        };
    await user.save();
    console.log(user);
    req.flash('success', 'Successfully updated user!');
    res.redirect (`/users/${user._id}`);
  };

module.exports.destroy = async (req, res) => {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted user');
    res.redirect('/home');
}
