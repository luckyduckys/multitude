const cron = require('node-cron');
const scannerOps = require('./scanner_operations');
const models = require("./schemas_and_models");

//Sync server status every 30 seconds.
cron.schedule('*/30 * * * * *', function () {
    models.Scanner.find({}, async function(err, scanners) {

        if (err) {
            console.log(err);
        }

        for (let i = 0; i < scanners.length; i++) {
            let scannerStatus = {};

            scannerStatus = await scannerOps.scannerGetRequest(scanners[i], '/server/status');

            models.Scanner.updateOne({_id: scanners[i]._id}, {status: scannerStatus.status}, function(err, results) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
});

//Get Server properties every hour.
cron.schedule('*/45 * * * * *', function() {
    models.Scanner.find({}, async function(err, scanners) {

        if (err) {
            console.log(err);
        }

        for (let i = 0; i < scanners.length; i++) {
            let scannerProperties = {};

            if (scanners[i].status == 'offline') {
                console.log('Skipping until online...');
                continue;
            }

            scannerProperties = await scannerOps.scannerGetRequest(scanners[i], '/server/properties');
            
            if (!scannerProperties.hasOwnProperty('status')) {
                models.Scanner.updateOne({_id: scanners[i]._id}, {version: scannerProperties.server_version, type: scannerProperties.nessus_type}, function(err, results) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    });
});

module.exports = {
    cron
}