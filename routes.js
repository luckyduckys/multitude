const models = require("./schemas_and_models");
const _ = require("lodash");
const generalOps = require("./generalOps");
const sanitize = require("mongo-sanitize");

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('index.ejs', {title: 'index'});
    });
    
    app.get('/login', function(req, res) {
        res.render('login.ejs', {});
    });
    
    app.get('/vulnerabilities', function(req, res) {
        res.render('vulnerabilities.ejs', {title: 'vulnerabilities'});
    });
    
    app.get('/hosts', function(req, res) {
        res.render('hosts.ejs', {title: 'hosts'});
    });
    
    app.get('/manage/scanners', function(req, res) {
        res.render('scanners.ejs', {title: 'scanners'});
    });
    
    app.get('/manage/users', function(req, res) {
        let testData = [{
            firstName: "Billy Bob",
            lastName: "Thorton",
            username: "bthorton",
            email: "bthorton@gmail.com"
        }];
    
        res.render('users.ejs', {users: testData});
    });
    
    app.get('/manage/scans', function(req,res) {
        res.render('scans.ejs', {title: 'scans'});
    });

    app.get('/api/scanners', async function(req,res) {
        let scanners = models.Scanner.find({})
        let order = -1;

        if (_.hasIn(req.query, "orderby")) {

            if (_.hasIn(req.query, "order")) {
                if (_.lowerCase(req.query.order) === "ascending") {
                    order = 1;
                }
            }

            switch (_.lowerCase(req.query.orderby)) {
                case 'scanner name':
                    scannners = scanners.sort({name: order});
                    break;
                
                case 'ip address':
                    scanners = scanners.sort({ip: order});
                    break;
                
                case 'status':
                    scanners = scanners.sort({status: order});
                    break;
                
                case 'version':
                    scanners = scanners.sort({version: order});
                    break;
                
                default:
                    scanners = scanners.sort({type: order});
                    break;
    
            }
        }

        scanners = await scanners.exec()
        res.set('Content-Type', 'application/json');
        res.send(scanners);
    });

    app.post('/api/scanners', function(req,res) {
        let statusCode = 200;

        models.Scanner.find({ip: req.body.ipAddress}, function(err, results) {

            if (err) {
                console.log(err);
            }

            else if (results) {
                statusCode = 400;
            }
        });

        if (statusCode === 200) {
            let newScanner = new models.Scanner({
                ip: req.body.ipAddress, 
                name: req.body.name,
                username: req.body.username,
                password: req.body.password
            });
            
            newScanner.save();
        }

        res.sendStatus(statusCode);
    });

    app.delete('/api/scanners/:id', function(req, res) {
        models.Scanner.findByIdAndDelete(req.params.id, function (err) {
            if (err) {
                console.log(err);
            }
        });

        res.sendStatus(200);
    });

    app.get('/api/scans', async function(req, res) {
        let scans = models.Scan.find({})
        let order = -1;

        if (_.hasIn(req.query, "orderby")) {

            if (_.hasIn(req.query, "order")) {
                if (_.lowerCase(req.query.order) === "ascending") {
                    order = 1;
                }
            }

            switch (_.lowerCase(req.query.orderby)) {
                case 'name':
                    scans = scans.sort({name: order});
                    break;
                
                case 'scanner':
                    scans = scans.sort({scanner_name: order});
                    break;
                
                case 'created':
                    scans = scans.sort({created: order});
                    break;
                
                default:
                    scans = scans.sort({modified: order});
                    break;
    
            }
        }

        scans = await scans.exec()
        res.set('Content-Type', 'application/json');
        res.send(scans);
    });

    app.get('/api/hosts', async function(req, res) {
        let hosts = models.Host.find({})
        let order = -1;

        if (_.hasIn(req.query, "orderby")) {

            if (_.hasIn(req.query, "order")) {
                if (_.lowerCase(req.query.order) === "ascending") {
                    order = 1;
                }
            }

            switch (_.lowerCase(req.query.orderby)) {
                case 'fqdn':
                    hosts = hosts.sort({fqdn: order});
                    break;
                
                case 'address':
                    hosts = hosts.sort({ip: order});
                    break;
                
                case 'os':
                    hosts = hosts.sort({os: order});
                    break;
                
                default:
                    hosts = hosts.sort({lastScan: order});
                    break;
    
            }
        }

        hosts = await hosts.exec()
        res.set('Content-Type', 'application/json');
        res.send(hosts);
    });

    app.get('/api/vulnerabilities', async function(req, res) {

        let order = -1;
        let perPage;
        let pageNumber;
        let totalPages;
        let itemsToSkip;
        let pageInfo = {
            pageNumber: 1,
            totalPages: 1
        };

        let vulns =  models.Vulnerability.aggregate([
            { $group: { 
                    _id: '$pluginId',
                    severity: { $first: '$severity' },
                    pluginName: { $first: '$pluginName'},
                    pluginFamily: { $first: '$pluginFamily'},
                    instanceCount: { $sum: 1 },
              }
            }
        ]);

        let entryCount = models.Vulnerability.aggregate([
            { $group: { 
                    _id: '$pluginId',
                    severity: { $first: '$severity' },
                    pluginName: { $first: '$pluginName'},
                    pluginFamily: { $first: '$pluginFamily'},
                    instanceCount: { $sum: 1 },
              }
            }
        ]);

        if (_.hasIn(req.query, "pluginName")) {
            vulns = vulns.match({
                    pluginName: {
                        $regex: sanitize(req.query.pluginName), 
                        $options: "i"
                    }
            });

            entryCount = entryCount.match({
                pluginName: {
                    $regex: sanitize(req.query.pluginName), 
                    $options: "i"
                }
            });
        }

        if (_.hasIn(req.query, "pluginFamily")) {
            vulns = vulns.match({
                pluginFamily: {
                    $regex: sanitize(req.query.pluginFamily), 
                    $options: "i"
                }
            });

            entryCount = entryCount.match({
                pluginFamily: {
                    $regex: sanitize(req.query.pluginFamily), 
                    $options: "i"
                }
            });

        }

        if (_.hasIn(req.query, "pluginId")) {
            let num = _.toNumber(req.query.pluginId);

            if (!isNaN(num)) {
                vulns = vulns.match({
                    pluginId: {
                        $eq: num
                    }
                });
    
                entryCount = entryCount.match({
                    pluginId: {
                        $eq: num
                    }
                });
            }
        }

        if (_.hasIn(req.query, "severity")) {
            let num = _.toNumber(req.query.severity);

            if (num >= 1 && num <= 4) {
                vulns = vulns.match({
                    severity: {
                        $eq: num
                    }
                });
    
                entryCount = entryCount.match({
                    severity: {
                        $eq: num
                    }
                });
            }
        }

        if (_.hasIn(req.query, "orderby")) {

            if (_.hasIn(req.query, "order")) {
                if (_.lowerCase(req.query.order) === "ascending") {
                    order = 1;
                }
            }

            switch (_.lowerCase(req.query.orderby)) {
                case "severity":
                    vulns = vulns.sort({severity: order, _id: 1});
                    break;
                
                case "name":
                    vulns = vulns.sort({pluginName: order, _id: 1});
                    break;
                
                case "family":
                    vulns = vulns.sort({pluginFamily: order, _id: 1});
                    break;
                
                case "plugin id":
                    vulns = vulns.sort({_id: order});
                    break;
                
                default:
                    vulns = vulns.sort({instanceCount: order, _id: 1});
                    break;
            }   
        }

        else {
            vulns = vulns.sort({instanceCount: -1, _id: 1});
        }

        //Get counts after filtering
        entryCount.count("entryCount");
        entryCount = await entryCount.exec();

        if (_.hasIn(req.query, "perPage")) {
            perPage = Number(req.query.perPage);
            
            if (_.hasIn(req.query, "pageNumber")) {
                pageNumber = Number(req.query.pageNumber);
            }

            else {
                pageNumber = 1;
            }

            if (!isNaN(perPage) && !isNaN(pageNumber)) {

                totalPages = Math.ceil(entryCount[0].entryCount / perPage);

                if (pageNumber <= totalPages) {

                    if (pageNumber > 1) {

                        itemsToSkip = (pageNumber - 1) * perPage;
                        vulns = vulns.skip(itemsToSkip);
                        console.log(pageNumber);
                        console.log(vulns);
                    }

                    vulns = vulns.limit(perPage);

                    pageInfo = {pageNumber: pageNumber, totalPages: totalPages, perPage: perPage};
                }
            }
        }
        
        vulns = await vulns.exec();
        res.set('Content-Type', 'application/json');
        res.send({vulnerabilities: vulns, pageInfo: pageInfo});
    });

    app.get('/api/chart/totals', async function(req, res) {
        let counts = await models.Vulnerability.aggregate([
            { $group: {
                _id: '$severity',
                severityCount: { $sum: 1}
            }},

            { $sort: {
                _id: -1
            }},
        ]).exec();

        res.send(counts);
    })
}