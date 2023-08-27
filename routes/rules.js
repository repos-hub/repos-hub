const express = require('express');
const router = express.Router();

router.get("/", function (req, res) {
    res.render(__dirname + "/../views/rules.ejs", {isAuthenticated: req.isAuthenticated()})
})

module.exports = router;