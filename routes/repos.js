const express = require('express');
const router = express.Router();
const Repository = require('../models/Repository');

router.get("/", async function(req, res) {
    const repos = await Repository.find().sort({stars: "descending"})
    res.render(__dirname + "/../views/reposlist.ejs", {repos: repos, isAuthenticated: req.isAuthenticated()})
})


module.exports.list = router;