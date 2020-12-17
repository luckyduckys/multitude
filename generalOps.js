const https = require('https');

function httpRequest(scanner, path, method, data = null, token = null) {
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
                if (dataChunks != '') {
                    resolve(JSON.parse(dataChunks));
                }

                else {
                    resolve({success: 'success'});
                }
            });

            res.on('error', function (err) {
                reject(err);
            });
        });

        req.on('error', function(err) {
            reject(err);
        });

        if (method === 'POST') {
            req.write(JSON.stringify(data));
        }

        req.end();

    });
}

module.exports = {
    httpRequest
}