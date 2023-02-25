const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const PictureSchema = new Schema ({
    url: String,
    filename: String,
});

const UserSchema = new Schema ({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    birth_date: {
        type: Date,
    },
    country: {
        type: String,
    },
    terms_and_conditions: {
        type: Boolean,
    },
    profile_picture: PictureSchema,
    
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);
module.exports = User