const models = require('./schemas_and_models');
const _ = require("lodash");

async function doesVulnExist (host, nessus_vuln) {

    let result = await models.Vulnerability.findOne({
        host_id: host._id,
        ports: Object.keys(nessus_vuln.outputs[0].ports),
        pluginId: nessus_vuln.info.plugindescription.pluginid
    });

    if (result) {
        return result;
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
        pluginFamily: _.toLower(nessus_vuln.info.plugindescription.pluginfamily),
        pluginId: nessus_vuln.info.plugindescription.pluginid,
        pluginName: _.toLower(nessus_vuln.info.plugindescription.pluginname)
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

function updateVuln (vulnToUpdate, nessus_vuln = null, resolve = false) {
    
    if (resolve) {
        vulnToUpdate.resolved = new Date();
        vulnToUpdate.status = "resolved";
    }

    else if (nessus_vuln) {
        vulnToUpdate.resolved = undefined;
        vulnToUpdate.status = "active";
        
        if (nessus_vuln.info.plugindescription.pluginattributes.hasOwnProperty('description')) {
            vulnToUpdate.description = nessus_vuln.info.plugindescription.pluginattributes.description;
        }

        if (nessus_vuln.info.plugindescription.pluginattributes.hasOwnProperty('synopsis')) {
            vulnToUpdate.synopsis = nessus_vuln.info.plugindescription.pluginattributes.synopsis;
        }

        if(nessus_vuln.info.plugindescription.pluginattributes.hasOwnProperty('solution')) {
            vulnToUpdate.solution = nessus_vuln.info.plugindescription.pluginattributes.solution;
        }

        vulnToUpdate.save();
    }
}

module.exports = {
    doesVulnExist,
    createVuln,
    updateVuln
}