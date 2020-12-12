module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('index.ejs', {criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0});
    });
    
    app.get('/login', function(req, res) {
        res.render('login.ejs', {});
    });
    
    app.get('/vulnerabilities', function(req, res) {
        var testData = [{
            severity: 4,
            cvss: 10.0,
            name: "Adobe Reader Unsupported Version",
            family: "Adobe",
            pluginId: "012345",
            count: 10
        }];
    
        res.render('vulnerabilities.ejs', {vulnerabilities: testData});
    });
    
    app.get('/assets', function(req, res) {
        var testData = [{
            name: "Test Server",
            address: "192.168.110.16",
            os: "Windows Server 2019",
            lastScan: "December 4th, 2020",
            scanner: "Home Scanner"
        }];
    
        res.render('assets.ejs', {assets: testData});
    });
    
    app.get('/manage/scanners', function(req, res) {
        res.render('scanners.ejs');
    });
    
    app.get('/manage/users', function(req, res) {
        var testData = [{
            firstName: "Billy Bob",
            lastName: "Thorton",
            username: "bthorton",
            email: "bthorton@gmail.com"
        }];
    
        res.render('users.ejs', {users: testData});
    });
    
    app.get('/manage/scans', function(req,res) {
        var testData = [{
            name: "Home Network Scan",
            scanner: "Home Scanner",
            created: "December 4th, 2020",
            modified: "December 4th, 2020"
        }];
    
        res.render('scans.ejs', {scans: testData});
    });

    app.get('/api/scanners', function(req,res) {
        var testData = [{
                name: "Home Scanner",
                ip: "192.168.10.110",
                status: "Online",
                version: "7.6.12345",
                type: "Nessus Essentials"
            }, {
                name: "Home Scanner",
                ip: "192.168.10.110",
                status: "Online",
                version: "7.6.12345",
                type: "Nessus Essentials"
            }]

        res.send(testData);
    });

    app.post('/api/scanners', function(req,res) {
        console.log('I did it');
        res.send('You did it!');
    });
}