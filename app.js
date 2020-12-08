const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

app.set('view engine', 'ejs');

app.get('/login', function(req, res) {
    res.render('login.ejs', {});
});

app.get('/', function(req, res) {
    res.render('index.ejs', {criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0});
});

app.listen(3000, function() {
    console.log("Server listening on port 3000");
});