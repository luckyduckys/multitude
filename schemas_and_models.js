require('dotenv').config();
const mongoose = require("mongoose");

const vulnerabilitySchema = new mongoose.Schema({
    severity: {
        type: Number,
        min: 0,
        max: 1
    },

    port: {
        type: Number,
        min: 0,
        max: 65535
    },

    protocol: String,
    description: String,
    pluginFamily: String,
    pluginId: String
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

    scanner: {
        type: scannerSchema,
        required: true
    }
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
    vulnerability: vulnerabilitySchema
});

const Vulnerability = new mongoose.model('vulnerability', vulnerabilitySchema, 'vulnerabilities');
const Scanner = new mongoose.model('scanner', scannerSchema);
const Scan = new mongoose.model('scan', scanSchema);
const Asset = new mongoose.model('asset', assetSchema);

module.exports = {
    Vulnerability,
    Scanner,
    Scan,
    Asset
}