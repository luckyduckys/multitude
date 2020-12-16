const https = require('https');

function httpRequest(scanner, path, method, data = null, token=null) {
    return new Promise(function (resolve, reject) {
        let options = {
            host: scanner.ip,
            port: 8834,
            path: path,
            method: method,
            rejectUnauthorized: false,
            headers: {}
        }

        if (token) {
            options.headers['X-Cookie'] = 'token=' + token;
        }

        if (data) {
            options.headers['Content-Type'] = 'application/json';
            options.headers['Content-Length'] = JSON.stringify(data).length;
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

        if (method === 'POST') {
            req.write(JSON.stringify(data));
        }

        req.end();

    }).catch(function(err) {
        return (err);
    });
}

module.exports = {
    httpRequest
}