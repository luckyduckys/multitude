require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require('passport-local').Strategy;
const cron = require("./cron");
const models = require("./schemas_and_models");

var dbString = 'mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME;

mongoose.connect(dbString, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    httpOnly: true,
    resave: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    model.User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        models.User.findOne({username: username}, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        });
    }
));

require("./routes.js")(app, passport);

app.listen(3000, function() {
    console.log("Server listening on port 3000");
});