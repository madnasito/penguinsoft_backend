// Delete(Desactive), Modify, Get
// User(s)

// Importing
const express = require("express")
const app = express()
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const { verifyToken } = require('../middlewares/autentication')
const _ = require("underscore")


// Get user by username
app.get("/:username", (req, res) => {

    // let username = req.params.username

    User.find({}, )
        .exec((err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
        })
})

//Edit User
app.put("/:id", verifyToken, (req, res) => {

    // Receive user ID
    let id = req.params.id

    // Verify that the user for modify is the same of Token user
    if (req.user._id !== id) {
        return res.status(401).json({
            ok: false,
            err: {
                message: "Unauthorized"
            }
        })
    }

    // Pick form values using underscore
    let body = _.pick(req.body, ['name', 'lastname', 'password', 'email', 'username'])

    // Modify User
    User.findOneAndUpdate(id, body, { new: true }, (err, userDB) => {

        // Verify Errors
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // Create Token for new User
        let token = jwt.sign({ user: userDB }, process.env.SEED, { expiresIn: process.env.END_TOKEN })

        // User updated
        res.json({
            ok: true,
            userDB,
            token
        })
    })

})

// Delete (Desactive account usser)
app.delete("/:id", (req, res) => {

    // Geting id
    let id = req.params.id
        // New value
    let changeStatus = {
        status: false
    }

    // Modifying user
    User.findByIdAndUpdate(id, changeStatus, { new: true, runValidators: true }, (err, userDB) => {

        // Verify errors
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // Verify if user exists
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "The user does not exists"
                }
            })
        }

        // Send desactived user
        res.json({
            ok: true,
            userDB
        })
    })
})

// Export routes
module.exports = app