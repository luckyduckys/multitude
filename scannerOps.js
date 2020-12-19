const generalOps = require("./generalOps");

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

module.exports = {
    scannerLogin,
    scannerDestroySession
};