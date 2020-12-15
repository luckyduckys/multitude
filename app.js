require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const models = require("./schemas_and_models.js");
const scannerOps = require("./scanner_operations.js");

var dbString = 'mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME;

mongoose.connect(dbString, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

require("./routes.js")(app);

app.listen(3000, function() {
    console.log("Server listening on port 3000");
});

//Sync server status every 30 seconds.
cron.schedule('*/30 * * * * *', function () {
    models.Scanner.find({}, async function(err, scanners) {

        if (err) {
            console.log(err);
        }

        for (let i = 0; i < scanners.length; i++) {
            let scannerStatus = {};

            scannerStatus = await scannerOps.getStatus(scanners[i]);

            models.Scanner.updateOne({_id: scanners[i]._id}, {status: scannerStatus.status}, function(err, results) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
});