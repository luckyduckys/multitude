const generalOps = require("./generalOps");
const _ = require("lodash");
const sanitize = require("mongo-sanitize");

async function scannerLogin(scanner) {
    let cookie = {};

    try {
        cookie = await generalOps.httpRequest(scanner, '/session', "POST", {username: scanner.username, password: scanner.password});
    }

    catch (err) {
        throw (err);
    }

    return cookie;
}

async function scannerDestroySession(scanner, cookie) {
    let result = await generalOps.httpRequest(scanner, '/session', 'DELETE', null, cookie.token);

    try {
        result = await generalOps.httpRequest(scanner, '/session', 'DELETE', null, cookie.token);
    }

    catch (err) {
        throw (err);
    }

    return true;
}

function filterScanners (scannersQuery, userQuery) {
    let curFilter;

    if (_.hasIn(userQuery, "scannerName")) {
        curFilter = scannersQuery.getFilter();
        curFilter.name = {
            $regex: sanitize(userQuery.scannerName),
            $options: "i"
        }
        scannersQuery = scannersQuery.find(curFilter);
    }

    if (_.hasIn(userQuery, "ipAddress")) {
        curFilter = scannersQuery.getFilter();
        curFilter.ip = {
            $regex: sanitize(userQuery.ipAddress),
            $options: "i"
        }
        scannersQuery = scannersQuery.find(curFilter);
    }

    if (_.hasIn(userQuery, "status")) {
        curFilter = scannersQuery.getFilter();
        curFilter.status = {
            $regex: sanitize(userQuery.status),
            $options: "i"
        }
        scannersQuery = scannersQuery.find(curFilter);
    }

}

module.exports = {
    scannerLogin,
    scannerDestroySession,
    filterScanners
};