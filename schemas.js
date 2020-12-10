require('dotenv').config();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const assetSchema = new mongoose.Schema({

    ip: {
        type: String,
        required: true
    },

    fqdn: String,
    os: String,
    lastScan: Date,
    //scanner: scannerSchema,
    //vulnerability: vulnerabilitySchema
});

assetSchema.plugin(encrypt, { encryptionKey: process.env.ENC_KEY, signingKey: process.env.SIG_KEY });

module.exports = {
    assetSchema
}