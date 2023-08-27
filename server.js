const express = require('express');
const app = express();
const { logSuccess, logError, logInfo, logWarn } = require("./handlers/logger");
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('cookie-session');
const { checkAuth, checkNotAuth} = require("./handlers/authChecks");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
  }

// DATABASE
mongoose.connect(process.env.MONGO_SRV, {
}).then(() =>[
  logSuccess("Connected to the database!")
]).catch((err) =>{
  logError('Failed connect to the database!')
})

const initializePassport = require("./handlers/passport")
initializePassport(passport)
app.use(session({
  keys: [process.env.SESSION_SECRET],
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    domain: process.env.DOMAIN,
    maxAge: 86400000
  }
}))

app.use(express.urlencoded({ extended: false}))

app.use(passport.initialize())
app.use(passport.session())


app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    res.render(__dirname + "/views/index.ejs", {isAuthenticated: req.isAuthenticated(), user: req.user});
})

app.use("/login", require("./routes/auth").login);

app.use("/logout", require("./routes/auth").logout);

app.use("/rules", require("./routes/rules"));

app.listen(process.env.PORT)
logSuccess(`Server is listening on port ${process.env.PORT}`)