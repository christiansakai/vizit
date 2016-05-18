'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');
var querystring = require('querystring');

var schema = new mongoose.Schema({
    fullName: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    salt: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    facebook: {
        id: String
    },
    github: {
        id: String
    },
    google: {
        id: String
    },
    photo: String,
    gravatar: String
});

// method to remove sensitive information from user objects before sending them out
schema.methods.sanitize = function () {
    return _.omit(this.toJSON(), ['password', 'salt']);
};

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    if (this.isModified('email')) {
        if (/gmail\.com$/.test(this.email)) {
            var split = this.email.split('@');
            split[0] = split[0].split('.').join('');
            this.email = split.join('@');
        }
        var md5 = crypto.createHash('md5');
        this.email = this.email.toLowerCase();
        md5.update(this.email);
        this.gravatar = 'http://www.gravatar.com/avatar/'+md5.digest('hex')+'?'+querystring.stringify({s: 300, d: 'http://i.imgur.com/RHjWlqX.png'});
    }

    next();

});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', schema);
