const models = require("./schemas_and_models");

async function doesHostExist (nessus_host = {}) {
    let count = 0;
    let hostFound = {};

    if (nessus_host.hasOwnProperty('mac-address')) {
        count = await models.Host.countDocuments({mac_address: nessus_host['mac-address']}).exec();
        hostFound = await models.Host.find({mac_address: nessus_host['mac-address']}).exec();
    }

    else if (nessus_host.hasOwnProperty('host-fqdn')) {
        if (nessus_host.hasOwnProperty('netbios-name')) {
            count = await models.Host.countDocuments({fqdn: nessus_host['host-fqdn'], netbios_name: nessus_host['netbios-name']}).exec();
            hostFound = await models.Host.find({fqdn: nessus_host['host-fqdn'], netbios_name: nessus_host['netbios-name']}).exec();
        }

        else if(nessus_host.hasOwnProperty('operating-system')) {
            count = await models.Host.countDocuments({fqdn: nessus_host['host-fqdn'], os: nessus_host['operating-system']}).exec();
            hostFound = await models.Host.find({fqdn: nessus_host['host-fqdn'], os: nessus_host['operating-system']}).exec();
        }
    }

    if (count > 0) {
        return hostFound
    }

    else {
        return null;
    }
}

function createHost (nessus_host, scan_id, host_id) {

    let host = new models.Host({
        ip: nessus_host['host-ip'],
        scan_id: scan_id,
        nessus_id: host_id,
        last_scan: nessus_host.host_end
    });

    if (nessus_host.hasOwnProperty('mac-address')) {
        host.mac_address = nessus_host['mac-address'];
    }

    if (nessus_host.hasOwnProperty('netbios-name')) {
        host.netbios_name = nessus_host['netbios-name'];
    }

    if (nessus_host.hasOwnProperty('host-fqdn')) {
        host.fqdn = nessus_host['host-fqdn'];
    }

    host.save()
}

module.exports = {
    doesHostExist,
    createHost
}