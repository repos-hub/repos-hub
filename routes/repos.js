const express = require('express');
const router = express.Router();
const Repository = require('../models/Repository');
const router2 = express.Router();
const { checkAuth } = require("../handlers/authChecks")
const router3 = express.Router();
const axios = require("axios"); 
const router4 = express.Router();
const User = require("../models/User")

router.get("/", async function(req, res) {
    const repos = await Repository.find({ status: "approved"}).sort({stars: "descending"})
    res.render(__dirname + "/../views/reposlist.ejs", {repos: repos, isAuthenticated: req.isAuthenticated()})
})

router2.get("/", checkAuth, async function(req, res) {
    const repos = await Repository.find({ owner: req.user.profile.login}).sort({stars: "descending"})
    res.render(__dirname + "/../views/yourrepos.ejs", {repos: repos, isAuthenticated: req.isAuthenticated()})
})

router3.get("/", checkAuth, async function(req, res) {
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

router3.post("/", checkAuth, async function (req, res) {
    const findRepo = await Repository.findOne({name: req.body.repo, owner: req.user.profile.login})
    if (findRepo) {
        res.render(__dirname + "/../views/message.ejs", {isAuthenticated: req.isAuthenticated(), message: "This repository is already in the list."})
    } else {
     const repo = await axios.get(`https://api.github.com/repos/${req.user.profile.login}/${req.body.repo}`, {
        headers: {Authorization: `Bearer ${req.user.accessToken}`,
        "Content-Type": "application/json"}
    }) 
    const newrepo = new Repository({
        name: req.body.repo,
        owner: req.user.profile.login,
        stars: repo.data.stargazers_count,
        forks: repo.data.forks_count,
        watchers: repo.data.subscribers_count,
        description: req.body.description,
        repoofmonth: false,
        githublink: repo.data.html_url,
        websitelink: req.body.websitelink,
        docslink: req.body.docslink,
        status: "0"
    })
    newrepo.save()
    res.redirect("/yourrepos")
}
})

router4.get("/:repo/:owner?", checkAuth, async function(req, res) {
    const findRepo = await Repository.findOne({name: req.params.repo, owner: req.user.profile.login})
    const user = await User.findOne({username: req.user.profile.login})
    if (findRepo) {
        const deleteRepo = await Repository.findOneAndRemove({name: req.params.repo, owner: req.user.profile.login})
        res.render(__dirname + "/../views/message.ejs", {isAuthenticated: req.isAuthenticated(), message: `Repository ${req.params.repo} has been deleted.`})
    } else if (user.isAdmin) {
        const deleteRepo = await Repository.findOneAndRemove({name: req.params.repo, owner: req.params.owner})
        res.render(__dirname + "/../views/message.ejs", {isAuthenticated: req.isAuthenticated(), message: `Repository ${req.params.repo} has been deleted.`})
    } else {
        res.render(__dirname + "/../views/message.ejs", {isAuthenticated: req.isAuthenticated(), message: "This repository is not in the list."})
    }
})

module.exports.list = router;
module.exports.yourrepos = router2;
module.exports.addrepo = router3;
module.exports.delrepo = router4;