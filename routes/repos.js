const express = require('express');
const router = express.Router();
const Repository = require('../models/Repository');
const router2 = express.Router();
const { checkAuth } = require("../handlers/authChecks")
const router3 = express.Router();
const axios = require("axios"); 

router.get("/", async function(req, res) {
    const repos = await Repository.find({ status: "accepted"}).sort({stars: "descending"})
    res.render(__dirname + "/../views/reposlist.ejs", {repos: repos, isAuthenticated: req.isAuthenticated()})
})

router2.get("/", checkAuth, async function(req, res) {
    const repos = await Repository.find({ owner: req.user.profile.login}).sort({stars: "descending"})
    res.render(__dirname + "/../views/yourrepos.ejs", {repos: repos, isAuthenticated: req.isAuthenticated()})
})

router3.get("/", async function(req, res) {
    const repo = await axios.get("https://api.github.com/user/repos", {
        headers: {Authorization: `Bearer ${req.user.accessToken}`,
        "Content-Type": "application/json"}
    })
   let repolist = [];
    repo.data.forEach((repo) => {
        repolist.push(repo.name)
        })    
    res.render(__dirname + "/../views/request.ejs", {isAuthenticated: req.isAuthenticated(), repos: repolist})
})

router3.post("/", async function (req, res) {
     const repo = await axios.get(`https://api.github.com/repos/${req.user.profile.login}/${req.body.repo}`, {
        headers: {Authorization: `Bearer ${req.user.accessToken}`,
        "Content-Type": "application/json"}
    }) 
    const newrepo = new Repository({
        name: req.body.repo,
        owner: req.user.profile.login,
        stars: repo.data.stargazers_count,
        forks: repo.data.forks,
        watchers: repo.data.watchers,
        description: req.body.description,
        repoofmonth: false,
        githublink: repo.data.html_url,
        websitelink: req.body.websitelink,
        docslink: req.body.docslink,
        status: "in-review"
    })
    newrepo.save()
    res.redirect("/yourrepos")
})

module.exports.list = router;
module.exports.yourrepos = router2;
module.exports.addrepo = router3;