const express = require('express');
const app = express();
const { logSuccess, logError, logInfo, logWarn } = require("./handlers/logger");
const path = require('path');

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
  }

app.use(express.static(path.join(__dirname, "public")))

app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    res.render(__dirname + "/views/index.ejs", {})
})


app.listen(process.env.PORT)
logSuccess(`Server is listening on port ${process.env.PORT}`)