const https = require('https');

function getStatus(scanner) {

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

        res.on('end', function() {
            let jsonified = JSON.parse(dataChunks);
            console.log(jsonified);
        });
    });

    req.on('error', function(err) {
        console.log(err);
    });

    req.end()
}

module.exports = {
    getStatus
};