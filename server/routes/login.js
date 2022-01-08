// User Login for verify and create Token

const express = require('express')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const app = express()

const User = require('../models/user')

app.post("/login", (req, res) => {

    let body = req.body

    // Find user by email
    User.findOne({ email: body.email }, (err, userDB) => {

        //Verify Error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // Verify if user exists on DB
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "The user does not exists"
                }
            })
        }

        // Compare encrypt password with form password
        if (bcrypt.compareSync(body.password, userDB.password)) {

            //Create access Tokem
            let token = jwt.sign({ user: userDB }, process.env.SEED, { expiresIn: process.env.END_TOKEN })

            res.json({
                ok: true,
                user: userDB,
                token
            })

        } else {
            // Send Error message for incorrect password
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Incorrect Password"
                }
            })
        }

    })

})

// Export Route
module.exports = app