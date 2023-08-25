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

  module.exports.checkAuth = checkAuth
  module.exports.checkNotAuth = checkNotAuth