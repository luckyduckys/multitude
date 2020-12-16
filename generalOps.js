const https = require('https');

function getRequest(scanner, path, token=null) {
    return new Promise(function (resolve, reject) {
        let options = {
            host: scanner.ip,
            port: 8834,
            path: path,
            method: 'GET',
            rejectUnauthorized: false
        }

        if (token) {
            options.headers = {
                'X-Cookie': 'token=' + token 
            }
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
    getRequest
}