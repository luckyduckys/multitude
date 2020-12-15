require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cron = require("./cron");

var dbString = 'mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME;

mongoose.connect(dbString, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

require("./routes.js")(app);

app.listen(3000, function() {
    console.log("Server listening on port 3000");
});