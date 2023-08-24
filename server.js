const express = require('express');
const app = express();
const { logSuccess, logError, logInfo, logWarn } = require("./handlers/logger");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
  }

app.set('view engine', 'ejs');


app.listen(process.env.PORT)
logSuccess(`Server is listening on port ${process.env.PORT}`)