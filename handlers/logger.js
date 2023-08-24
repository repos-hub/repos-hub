const colors = require("colors")

function logSuccess(message) {
    console.log(colors.green("[SUCCESS] ") +  message)
}

function logError(message) {
    console.log(colors.red("[ERROR] ") + colors.red(message))
}

function logInfo(message) {
    console.log(colors.blue("[INFO] ") + message)
}

function logWarn(message) {
    console.log(colors.yellow("[WARN] ") + message)
}

module.exports.logSuccess = logSuccess
module.exports.logError = logError
module.exports.logInfo = logInfo
module.exports.logWarn = logWarn