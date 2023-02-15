const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
};

module.exports.register = async(req, res, next) => {
    try{
        const { first_name, last_name, username, email, birth_date, password, repeat_password } = req.body.user;
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
    res.redirect('/campgrounds');
}

