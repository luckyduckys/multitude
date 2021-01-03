const https = require('https');

function httpRequest(scanner, path, method, data = null, token = null) {
    return new Promise(function (resolve, reject) {
        let options = {
            host: scanner.ip,
            port: 8834,
            path: path,
            method: method,
            rejectUnauthorized: false,
            headers: {}
        }

        if (token) {
            options.headers['X-Cookie'] = 'token=' + token;
        }

        if (data) {
            options.headers['Content-Type'] = 'application/json';
            options.headers['Content-Length'] = JSON.stringify(data).length;
        }

        const req = https.request(options, function(res) {
            let dataChunks = '';

            res.on('data', function(chunk) {
                dataChunks += chunk;
            });

            res.on('end', function () {
                if (dataChunks != '') {
                    resolve(JSON.parse(dataChunks));
                }

                else {
                    resolve({success: 'success'});
                }
            });

            res.on('error', function (err) {
                reject(err);
            });
        });

        req.on('error', function(err) {
            reject(err);
        });

        if (method === 'POST') {
            req.write(JSON.stringify(data));
        }

        req.end();

    });
}

async function paginate(modelToPaginate, perPage, pageNumber) {
    let totalObjects;
    let totalPages;
    let itemsToSkip;
    let curFilter;

    if (isNaN(perPage) || isNaN(pageNumber)) {
        throw {error: "perPage and pageNumber must be a number greater than zero"};
    }

    else if ((perPage < 1 && perPage > 100) && (pageNumber > 0)) {
        throw {error: "perPage and pageNumber must be a number greater than zero"}
    }

    else {
        
        try {
            curFilter = modelToPaginate.getFilter();
            totalObjects = await modelToPaginate.estimatedDocumentCount()
        }

        catch (err) {
            throw err;
        }

        modelToPaginate.find(curFilter);

        totalPages = Math.ceil(totalObjects / perPage);

        if (pageNumber > totalPages) {
            console.log(totalPages);
            console.log(pageNumber);
            throw {error: "page number must be less than total number of pages"};
        }

        itemsToSkip = (pageNumber - 1) * perPage;
        
        if (itemsToSkip > 0) {
            modelToPaginate = modelToPaginate.skip(itemsToSkip).limit(perPage);
        }

        else {
            modelToPaginate.limit(perPage);
        }
    }

    return ({totalPages: totalPages, perPage: perPage, pageNumber: pageNumber});
}

module.exports = {
    httpRequest,
    paginate
}