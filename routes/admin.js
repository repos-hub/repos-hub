const express = require("express")
const router = express.Router()
const { logError, logSuccess } = require("../handlers/logger")
const { checkAuth, checkNotAuth, checkAdmin } = require("../handlers/authChecks")
const Repo = require("../models/Repository")

router.get("/", checkAuth, checkAdmin, async function (req, res) {
    const repos = await Repo.find().sort({status: "ascending"})
    res.render(__dirname + "/../views/admin.ejs", {isAuthenticated: req.isAuthenticated(), user: req.user, repos: repos, csrfToken: req.csrfToken()});
})


router.get("/approve/:owner/:repo", checkAuth, checkAdmin, async function (req, res) {
    const repo = await Repo.findOne({owner: req.params.owner, name: req.params.repo})
    repo.status = "2"
    repo.save()
    res.redirect("/admin")
}) 

router.get("/reject/:owner/:repo", checkAuth, checkAdmin, async function (req, res) {
    const repo = await Repo.findOne({owner: req.params.owner, name: req.params.repo})
    repo.status = "1"
    repo.save()
    res.redirect("/admin")
})

module.exports.admin = router