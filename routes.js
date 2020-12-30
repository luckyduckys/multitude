const models = require("./schemas_and_models");
const _ = require("lodash");

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

    app.get('/api/scanners', function(req,res) {
        models.Scanner.find({}, function(err, results) {
            if (err) {
                console.log(err);
            }

            res.set('Content-Type', 'application/json');
            res.send(results);
        });
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

    app.get('/api/scans', function(req, res) {
        models.Scan.find({}, function(err, results) {
            if (err) {
                console.log(err);
            }

            res.set('Content-Type', 'application/json');
            res.send(results);
        });
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

        hosts = await hosts.exec()
        res.set('Content-Type', 'application/json');
        res.send(hosts);
    });

    app.get('/api/vulnerabilities', async function(req, res) {

        let order = -1;
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

        let counts = await models.Vulnerability.aggregate([
            { $group: {
                _id: '$severity',
                severityCount: { $sum: 1}
            }},

            { $sort: {
                _id: -1
            }},
        ]).exec();

        if (_.hasIn(req.query, "orderby")) {

            if (_.hasIn(req.query, "order")) {
                if (_.lowerCase(req.query.order) === "ascending") {
                    order = 1;
                }
            }

            switch (_.lowerCase(req.query.orderby)) {
                case "severity":
                    vulns = vulns.sort({severity: order});
                    break;
                
                case "name":
                    vulns = vulns.sort({pluginName: order});
                    break;
                
                case "family":
                    vulns = vulns.sort({pluginFamily: order});
                    break;
                
                case "plugin id":
                    vulns = vulns.sort({_id: order});
                    break;
                
                default:
                    vulns = vulns.sort({instanceCount: order});
                    break;
            }   
        }

        vulns = await vulns.exec();

        res.set('Content-Type', 'application/json');
        res.send({vulnerabilities: vulns, vulnerability_counts: counts});
    });
}