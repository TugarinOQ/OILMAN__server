const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    regDate: {
        type: Date,
        required: true
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    sex: {
        type: Number
    },
    avatar: {
        type: String
    },
    ip: {
        type: String
    },
    accessOnIP: {
        type: String
    },
    businessInvoice: {
        type: Number
    },
    invoice: {
        type: Number
    }
});

UserSchema.pre('save', function(callback) {
    const user = this;

    if (!user.isModified('password')) return callback();

    bcrypt.genSalt(5, function(err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

UserSchema.methods.verifyPassword = function(password, cb, _thisPassword) {
    bcrypt.compare(password, this.password || _thisPassword, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = { Schema: mongoose.model('User', UserSchema), verifyPassword: UserSchema.methods.verifyPassword};