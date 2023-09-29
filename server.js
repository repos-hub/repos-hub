const express = require('express');
const app = express();
const { logSuccess, logError, logInfo, logWarn } = require("./handlers/logger");
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('cookie-session');
const { checkAuth, checkNotAuth} = require("./handlers/authChecks");
const RateLimit = require("express-rate-limit");
const User = require("./models/User")

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
  }
// RATE LIMITER

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
})

app.use(limiter)

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

app.get("/", async function (req, res) {
  if (req.user) {
    const userdb = await User.findOne({username: req.user.profile.login})
    res.render(__dirname + "/views/index.ejs", {isAuthenticated: req.isAuthenticated(), user: req.user, userdb: userdb });
  } else {
    res.render(__dirname + "/views/index.ejs", {isAuthenticated: req.isAuthenticated(), user: req.user, userdb: null });
  }
})

app.use("/login", require("./routes/auth").login);

app.use("/logout", require("./routes/auth").logout);

app.use("/rules", require("./routes/rules"));

app.use("/repos", require("./routes/repos").list)

app.use("/yourrepos", require("./routes/repos").yourrepos)

app.use("/request", require("./routes/repos").addrepo)

app.use("/delrepo", require("./routes/repos").delrepo)


app.use("/admin", require("./routes/admin").admin)

app.listen(process.env.PORT)
logSuccess(`Server is listening on port ${process.env.PORT}`)