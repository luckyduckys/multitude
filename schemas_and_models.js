require('dotenv').config();
const mongoose = require("mongoose");
const encryption = require("mongoose-encryption");
const bcrypt = require("bcrypt");

const vulnerabilitySchema = new mongoose.Schema({
    severity: {
        type: Number,
        min: 0,
        max: 4
    },

    ports: [String],
    status: String,
    resolved: Date,
    added: Date,
    description: String,
    pluginName: String,
    pluginFamily: String,
    pluginId: Number,
    synopsis: String,
    solution: String,
    host_id: {
        type: String,
        required: true
    }
});

const scannerSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },

    name: String,
    status: String,
    version: String,
    type: String,
    username: String,
    password: String,
});

const scanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    created: Date,
    modified: Date,
    last_imported: Date,
    nessus_id: Number,
    scanner_name: String,
    scanner_id: {
        type: String,
        required: true
    }
});

const hostSchema = new mongoose.Schema({

    ip: {
        type: String,
        required: true
    },

    mac_address: String,
    netbios_name: String,
    fqdn: String,
    os: String,
    lastScan: Date,
    nessus_id: Number,
    scan_id: String
});

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
});

scannerSchema.plugin(encryption, {
    encryptionKey: process.env.ENC_KEY,
    signingKey: process.env.SIG_KEY,
    encryptedFields: ['username', 'password']
});

userSchema.pre('save', function(next) {

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.hash(user.password, process.env.SALT_ROUNDS, function(err, hash) {

        if (err) {
            return next(err);
        }         

        user.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {

    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {

        if (err) {
            return cb(err);
        }

        cb(null, isMatch);
    });
}

const Vulnerability = new mongoose.model('vulnerability', vulnerabilitySchema, 'vulnerabilities');
const Scanner = new mongoose.model('scanner', scannerSchema);
const Scan = new mongoose.model('scan', scanSchema);
const Host = new mongoose.model('host', hostSchema);
const User = new mongoose.model('user', userSchema);

module.exports = {
    Vulnerability,
    Scanner,
    Scan,
    Host,
    User
}