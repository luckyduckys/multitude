const models = require('./schemas_and_models');

async function doesVulnExist (host, nessus_vuln) {

    let results = await models.Vulnerability.findOne({
        host_id: host._id,
        ports: Object.keys(nessus_vuln.outputs[0].ports),
        pluginId: nessus_vuln.info.plugindescription.pluginid
    });

    if (results) {
        return results;
    }

    else {
        return false;
    }
}

function createVuln (host, nessus_vuln) {
    let newVuln = new models.Vulnerability ({
        host_id: host._id,
        severity: nessus_vuln.info.plugindescription.severity,
        ports: Object.keys(nessus_vuln.outputs[0].ports),
        status: 'active',
        added: new Date(),
        pluginFamily: nessus_vuln.info.plugindescription.pluginfamily,
        pluginId: nessus_vuln.info.plugindescription.pluginid,
    })

    if (nessus_vuln.info.plugindescription.pluginattributes.hasOwnProperty('description')) {
        newVuln.description = nessus_vuln.info.plugindescription.pluginattributes.description;
    }

    if (nessus_vuln.info.plugindescription.pluginattributes.hasOwnProperty('synopsis')) {
        newVuln.synopsis = nessus_vuln.info.plugindescription.pluginattributes.synopsis;
    }

    if(nessus_vuln.info.plugindescription.pluginattributes.hasOwnProperty('solution')) {
        newVuln.solution = nessus_vuln.info.plugindescription.pluginattributes.solution;
    }

    newVuln.save();
}

module.exports = {
    doesVulnExist,
    createVuln
}