const cron = require('node-cron');
const generalOps = require('./generalOps');
const scannerOps = require('./scannerOps');
const hostOps = require('./hostOps');
const vulnOps = require('./vulnOps');
const models = require('./schemas_and_models');

//Sync server status every 30 seconds.
cron.schedule('*/30 * * * * *', function () {
    models.Scanner.find({}, async function(err, scanners) {

        if (err) {
            console.log(err);
        }

        for (let i = 0; i < scanners.length; i++) {
            let scannerStatus = {};

            try {
                scannerStatus = await generalOps.httpRequest(scanners[i], '/server/status', 'GET');
            }
            catch (err) {
                scannerStatus = {
                    status: 'offline'
                }
            }

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
cron.schedule('0 * * * *', function() {
    models.Scanner.find({}, async function(err, scanners) {
        if (err) {
            console.log(err);
        }

        for (let i = 0; i < scanners.length; i++) {
            let cookie = {};
            let scans = {};

            if (scanners[i].status === 'offline') {
                continue;
            }

            try {
                cookie = await scannerOps.scannerLogin(scanners[i]);
                scans = await generalOps.httpRequest(scanners[i], '/scans', 'GET', null, cookie.token);
            }

            catch(error) {
                continue;
            }

            for (let j = 0; j < scans.scans.length; j++) {
                
                let newScan = {
                    name: scans.scans[j].name, 
                    created: new Date(scans.scans[j].creation_date * 1000),
                    modified: new Date(scans.scans[j].last_modification_date * 1000),
                    nessus_id: scans.scans[j].id,
                    scanner_id: scanners[i]._id,
                    scanner_name: scanners[i].name
                }

                models.Scan.findOneAndUpdate({nessus_id: scans.scans[j].id}, newScan, {upsert: true, new: true}, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                });
            }

            try {
                await scannerOps.scannerDestroySession(scanners[i], cookie);
            }

            catch (err){
                console.log("cookie destroy fail");
                continue;
            }
        }
    });
});

cron.schedule('*/7 * * * * *', function() {
    let scanDetails = {};
    let scans = [];
    let hostDetails = {};
    let foundHost = {};
    let vulnDetails = {};
    let curHost = {};
    let curVuln = {};

    models.Scanner.find({status: 'ready'}, async function(err, scanners) {

        if (err) {
            console.log(err);
        }

        for (let i = 0; i < scanners.length; i++) {

            //Check if scanner is online and get login token
            if (scanners[i].status != 'ready') {
                continue;
            }
            
            try {
                var cookie = await scannerOps.scannerLogin(scanners[i]);
            }

            catch(error) {
                continue;
            }

            //Get all scan host details for scanner
            scans = await models.Scan.find({scanner_id: scanners[i]._id}).exec();

            for (let j = 0; j < scans.length; j++) {

                //Only import if the scan has changed since last modification date (last scan date)
                if(scans[j].last_imported === undefined || scans[j].last_imported < scans[j].modified ) {
                    
                    let scanPath = '/scans/' + scans[j].nessus_id;

                    try {
                        scanDetails = await generalOps.httpRequest(scanners[i], scanPath, 'GET', null, cookie.token);
                    }

                    catch {
                        continue;
                    }

                    //Update or create all hosts
                    for (let k = 0; k < scanDetails.hosts.length; k++) {

                        let hostPath = scanPath + '/hosts/' + scanDetails.hosts[k].host_id;
                        hostDetails = await generalOps.httpRequest(scanners[i], hostPath, 'GET', null, cookie.token);
                        foundHost = await hostOps.doesHostExist(hostDetails.info);

                        if (foundHost) {
                            curHost = foundHost;
                            hostOps.updateHost(foundHost, hostDetails.info, scans[j].nessus_id, scanDetails.hosts[k].host_id);
                        }

                        else {
                            curHost = await hostOps.createHost(hostDetails.info, scans[j].nessus_id, scanDetails.hosts[k].host_id);
                        }

                        //Close out all vulnerabilities
                        models.Vulnerability.updateMany({host_id: curHost._id}, {status: 'resolved', resolved: new Date()});

                        //Update or create all vulnerabilities, assume the one's not present in the report are resolved and stay resolved.
                        for (let l = 0; l < hostDetails.vulnerabilities.length; l++) {
                            let vulnPath = hostPath + '/plugins/' + hostDetails.vulnerabilities[l].plugin_id;

                            try {
                                vulnDetails = await generalOps.httpRequest(scanners[i], vulnPath, 'GET', null, cookie.token);
                            }

                            catch {
                                break;
                            }

                            if (vulnDetails.info.plugindescription.severity != 0) {

                                curVuln = await vulnOps.doesVulnExist(curHost, vulnDetails);

                                if (curVuln) {
                                    vulnOps.updateVuln(curVuln, vulnDetails);
                                }

                                else {
                                    vulnOps.createVuln(curHost, vulnDetails);
                                }
                            }
                        }
                    }

                    scans[j].last_imported = new Date();
                    scans[j].save();
                }
            }

            try {
                await scannerOps.scannerDestroySession(scanners[i], cookie);
            }

            catch (err){
                console.log("cookie destroy fail");
                continue;
            }
        }
    });
});

module.exports = {
    cron
}