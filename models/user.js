const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

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
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);