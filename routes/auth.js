const express = require("express");
const router = express.Router()
const router2 = express.Router()
const passport = require("passport");
const lusca =  require("lusca")

router.get("/", passport.authenticate("github", { scope: [ 'user:email', "public_repo" ] }))

router.get("/callback", passport.authenticate("github", { failureRedirect: "/", successRedirect: "/"}))

router2.post('/',  lusca.csrf() ,function(req, res, next){
    req.logout();
    res.redirect('/');
  });

module.exports.login = router
module.exports.logout = router2

