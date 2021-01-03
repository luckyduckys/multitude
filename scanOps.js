const sanitize = require("mongo-sanitize");
const _ = require("lodash");

function filterScans (scansQuery, userQuery) {
    let curFilter;

    if (_.hasIn(userQuery, "scanName")) {
        curFilter = scansQuery.getFilter();
        curFilter.name = {
            $regex: sanitize(userQuery.scanName),
            $options: "i"
        }
        scansQuery = scansQuery.find(curFilter);
    }

    if (_.hasIn(userQuery, "scannerName")) {
        curFilter = scansQuery.getFilter();
        curFilter.scanner_name = {
            $regex: sanitize(userQuery.scannerName),
            $options: "i"
        }
        scansQuery = scansQuery.find(curFilter);
    }
}

module.exports = {
    filterScans
}