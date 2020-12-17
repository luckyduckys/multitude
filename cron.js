const cron = require('node-cron');
const generalOps = require('./generalOps');
const scannerOps = require('./scannerOps');
const models = require("./schemas_and_models");

//Sync server status every 30 seconds.
cron.schedule('*/30 * * * * *', function () {
    models.Scanner.find({}, async function(err, scanners) {

        if (err) {
            console.log(err);
        }

        for (let i = 0; i < scanners.length; i++) {
            let scannerStatus = {};

            scannerStatus = await generalOps.httpRequest(scanners[i], '/server/status', 'GET');

            models.Scanner.updateOne({_id: scanners[i]._id}, {status: scannerStatus.status}, function(err, results) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
});

//Get Server properties every hour.
cron.schedule('0 * * * *', function() {
    models.Scanner.find({}, async function(err, scanners) {

        if (err) {
            console.log(err);
        }

        for (let i = 0; i < scanners.length; i++) {
            let scannerProperties = {};

            if (scanners[i].status == 'offline') {
                continue;
            }

            try {
                scannerProperties = await generalOps.httpRequest(scanners[i], '/server/properties', 'GET');
            }

            catch {
                continue;
            }
            
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

//Get Scans every hour
cron.schedule('*/7 * * * * *', function() {
    models.Scanner.find({}, async function(err, scanners) {
        if (err) {
            console.log(err);
        }

        for (let i = 0; i < scanners.length; i++) {
            let cookie = {};

            if (scanners[i].status === 'offline') {
                continue;
            }

            try {
                cookie = await scannerOps.scannerLogin(scanners[i]);
            }

            catch(error) {
                continue;
            }

            if (!cookie.hasOwnProperty('status')) {

                try {
                    let scansArr = await generalOps.httpRequest(scanners[i], '/scans', 'GET', null, cookie.token);
                }

                catch(error) {
                    continue;
                }
                
                if (!scansArr.hasOwnProperty('status')) {

                    for (let j = 0; j < scansArr.scans.length; j++) {
                        
                        let newScan = {
                            name: scansArr.scans[j].name, 
                            created: new Date(scansArr.scans[j].creation_date * 1000),
                            modified: new Date(scansArr.scans[j].last_modification_date * 1000),
                            nessus_id: scansArr.scans[j].id,
                            scanner: scanners[i]
                        }

                        models.Scan.findOneAndUpdate({nessus_id: scansArr.scans[j].id}, newScan, {upsert: true, new: true}, function (err, results) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                }

                scannerOps.scannerDestroySession(scanners[i], cookie);
            }
        }
    });
});

module.exports = {
    cron
}