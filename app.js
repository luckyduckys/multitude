const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

app.set('view engine', 'ejs');

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
    }]
    res.render('vulnerabilities.ejs', {vulnerabilities: testData});
});

app.listen(3000, function() {
    console.log("Server listening on port 3000");
});