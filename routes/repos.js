const express = require('express');
const router = express.Router();
const Repository = require('../models/Repository');
const router2 = express.Router();
const { checkAuth } = require("../handlers/authChecks")

router.get("/", async function(req, res) {
    const repos = await Repository.find({ status: "accepted"}).sort({stars: "descending"})
    res.render(__dirname + "/../views/reposlist.ejs", {repos: repos, isAuthenticated: req.isAuthenticated()})
})

router2.get("/", checkAuth, async function(req, res) {
    const repos = await Repository.find({ owner: req.user.login}).sort({stars: "descending"})
    res.render(__dirname + "/../views/yourrepos.ejs", {repos: repos, isAuthenticated: req.isAuthenticated()})
})


module.exports.list = router;
module.exports.yourrepos = router2;