const generalOps = require("./generalOps");

async function scannerLogin(scanner) {
    let cookie = await generalOps.httpRequest(scanner, '/session', "POST", {username: scanner.username, password: scanner.password});
    
    if(cookie.hasOwnProperty('status')) {
        throw new Error('Scanner is offline');
    }

    return cookie;
}

async function scannerDestroySession(scanner, cookie) {
    let result = await generalOps.httpRequest(scanner, '/session', 'DELETE', null, cookie.token);

    if (result.hasOwnProperty('status')) {
        throw new Error('Scanner is offline');
    }

    console.log("Destroyed Session");
}

module.exports = {
    scannerLogin,
    scannerDestroySession
};