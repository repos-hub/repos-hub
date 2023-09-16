const User = require("../models/User")

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect("/login")
}

// CHECK IF USER IS NOT LOGGED IN

function checkNotAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/")
  }
  next()
}

async function checkAdmin(req, res, next) {
  const checkAdmin = await User.findOne({username: req.user.profile.login})
  if (checkAdmin.isAdmin) {
    next()
  } else {
    res.redirect("/")
  }
}

  module.exports.checkAuth = checkAuth
  module.exports.checkNotAuth = checkNotAuth
  module.exports.checkAdmin = checkAdmin