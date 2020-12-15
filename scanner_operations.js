const https = require('https');
const { resolve } = require('path');

function getStatus(scanner) {
    return new Promise(function (resolve, reject) {
        let options = {
            host: scanner.ip,
            port: 8834,
            path: '/server/status',
            method: 'GET',
            rejectUnauthorized: false
        }

        const req = https.request(options, function(res) {
            let dataChunks = '';

            res.on('data', function(chunk) {
                dataChunks += chunk;
            });

            res.on('end', function () {
                resolve(JSON.parse(dataChunks));
            });

            res.on('error', function () {
                reject({status: 'offline'});
            });
        });

        req.on('error', function() {
            reject({status: 'offline'});
        });

        req.end();

    }).catch(function(err) {
        return (err);
    });
}

function scannerLogin(scanner) {
    return new Promise(function (resolve, reject) {
        let credentials = JSON.stringify({
            username: scanner.username,
            password: scanner.password
        });

        let options = {
            host: scanner.ip,
            port: 8834,
            path: '/session',
            method: 'POST',
            rejectUnauthorized: false,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': credentials.length
            }
        }

        const req = https.request(options, function(res) {
            let dataChunks = '';

            res.on('data', function(chunk) {
                dataChunks += chunk;
            });

            res.on('end', function() {
                resolve(JSON.parse(dataChunks));
            });

            res.on('error', function(err) {
                reject(err);
            });
        });

        req.on('error', function(err) {
            reject(err);
        });

        req.write(credentials);
        req.end();
    });
}

function getServerProperties(scanner) {
    return new Promise(function (resolve, reject) {
        let options = {
            host: scanner.ip,
            port: 8834,
            path: '/server/properties',
            method: 'GET',
            rejectUnauthorized: false
        }

        const req = https.request(options, function(res) {
            let dataChunks = '';

            res.on('data', function(chunk) {
                dataChunks += chunk;
            });

            res.on('end', function () {
                resolve(JSON.parse(dataChunks));
            });

            res.on('error', function () {
                reject({status: 'offline'});
            });
        });

        req.on('error', function() {
            reject({status: 'offline'});
        });

        req.end();

    }).catch(function(err) {
        return (err);
    });
}

module.exports = {
    getStatus,
    scannerLogin,
    getServerProperties
};