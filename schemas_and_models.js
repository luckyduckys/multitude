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
    last_imported: Date,
    nessus_id: Number,

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

    fqdn: String,
    os: String,
    lastScan: Date,
    nessus_id: Number,
    scan: String,
    vulnerability_id: [String]
});

const Vulnerability = new mongoose.model('vulnerability', vulnerabilitySchema, 'vulnerabilities');
const Scanner = new mongoose.model('scanner', scannerSchema);
const Scan = new mongoose.model('scan', scanSchema);
const Host = new mongoose.model('host', hostSchema);

module.exports = {
    Vulnerability,
    Scanner,
    Scan,
    Host
}