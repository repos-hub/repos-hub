const express = require('express');
const router = express.Router();

router.get("/", function (req, res) {
    res.render(__dirname + "/../views/rules.ejs", {isAuthenticated: req.isAuthenticated(), csrfToken: req.csrfToken()})
})

module.exports = router;