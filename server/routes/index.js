// Importing
const express = require("express")
const app = express()

// Allows Routes by server
app.use(require("./app"))
app.use(require('./register'))
app.use(require("./user"))
app.use(require("./login"))
app.use(require("./upload"))
    // app.use(require('./upload_app'))

// Exporting routes for Index
module.exports = app