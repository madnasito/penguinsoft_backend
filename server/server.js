// Penguin Soft Backend Index
// server.js

// Importing
const express = require("express")
const app = express()
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json())
const mongoose = require("mongoose")
const colors = require("colors")

// Server Config
require('./config/config.js')

// Importing Routes
app.use(require("./routes/index"))

// Connecting at Data Base
mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {

    // Verify Errors
    if (err) {
        return err
    }

    console.log("Data base Online".rainbow)
})

// Listening port
app.listen(process.env.PORT, () => {
    console.log("Listening port:", process.env.PORT.green);
})