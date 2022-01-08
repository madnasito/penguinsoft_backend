// Register Users for DB

// Import
const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const User = require("../models/user")
const fs = require('fs')
const path = require('path')

// Api's Petition for Create an User
app.post('/register', (req, res) => {

    // Create a variable for Form content
    let body = req.body;

    // Create user for save
    let user = new User({
        publisher: body.publisher,
        name: body.name,
        lastname: body.lastname,
        username: body.username,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10)
    })

    // Save user
    user.save((err, userDB) => {

        // Verefy errors
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        let appsPath = path.resolve(__dirname, `../../user/${userDB._id}`)
        fs.mkdirSync(appsPath)
        fs.mkdirSync(`${appsPath}/apps`)

        // New User saved
        res.json({
            ok: true,
            userDB
        })
    })

})

//Export Route
module.exports = app