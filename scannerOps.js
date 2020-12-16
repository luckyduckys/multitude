const generalOps = require("./generalOps");

async function scannerLogin(scanner) {
    let cookie = await generalOps.httpRequest(scanner, '/session', "DELETE", {username: scanner.username, password: scanner.password});
    
    if(cookie.hasOwnProperty('status')) {
        throw new Error('Scanner is offline');
    }

    return cookie;
}

async function scannerDestroySession(scanner, token) {
    let result = await generalOps.httpRequest(scanner, '/session', 'DELETE', token=token);

    if (result.hasOwnProperty('status')) {
        throw new Error('Scanner is offline');
    }
}

module.exports = {
    scannerLogin
};