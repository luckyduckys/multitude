require('dotenv').config();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const scannerSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },

    name: String,

    status: {
        type: Number,
        min: 0,
        max: 1,
    },

    version: String,
    type: String,
    username: String,
    password: String,
});

const assetSchema = new mongoose.Schema({

    ip: {
        type: String,
        required: true
    },

    fqdn: String,
    os: String,
    lastScan: Date,
    scanner: scannerSchema,
    //vulnerability: vulnerabilitySchema
});

assetSchema.plugin(encrypt, { encryptionKey: process.env.ENC_KEY, signingKey: process.env.SIG_KEY });
scannerSchema.plugin(encrypt, { encryptionKey: process.env.ENC_KEY, signingKey: process.env.SIG_KEY });

module.exports = {
    assetSchema,
    scannerSchema
}