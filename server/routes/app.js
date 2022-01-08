// Get, Modify and Delete App

// Importing
const express = require("express")
const app = express()
const fileUpload = require('express-fileupload')
const _ = require("underscore")
const path = require('path')

const User = require('../models/user')
const App = require('../models/app')
const { verifyToken } = require("../middlewares/autentication")
const { appFileName, screenshotsExtension, appImage } = require('../middlewares/upload_validation')

// default options
app.use(fileUpload())

// Get App by Id
app.get('/app/:id', (req, res) => {

    let id = req.params.id

    App.findById(id, (err, appDB) => {


        if (!appDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "The app Does not exists"
                }
            })
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            app: appDB
        })
    })

})


app.put('/app/:id', verifyToken, (req, res) => {

    // Receive app ID
    let id = req.params.id

    App.findById(id, (err, app) => {

        if (!app) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "The app does not exists"
                }
            })
        }

        if (err) {
            return res.status(404).json({
                ok: false,
                err
            })
        }

        if (app.user != req.user._id) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Unauthorized"
                }
            })
        }

    })

    let body = req.body

    let appUpdate = {
        name: body.name,
        category: body.category,
        version: body.version,
        description: body.description,
        code: body.code
    }

    App.findOneAndUpdate(id, appUpdate, { new: true }, (err, appUpdated) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            appUpdated
        })
    })

})

app.put('/app/:id/assets', verifyToken, (req, res) => {

    let id = req.params.id

    App.findById(id, (err, app) => {

        if (!app) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "The app does not exists"
                }
            })
        }

        if (err) {
            return res.status(404).json({
                ok: false,
                err
            })
        }

        if (app.user != req.user._id) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Unauthorized"
                }
            })
        }


        // Verify
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.json({
                ok: false,
                err: {
                    message: "Files Error"
                }
            })
        }

        let screenshots = req.files.screenshots
        let img = req.files.img
        let screenshotsList
        let imgPath

        screenshotsList = screenshotsExtension(screenshots, req.user.username, app.name, res)
        console.log(screenshotsList)
        imgPath = appImage(img, req.user.username, app.name, res)

        let appScrennshots = {
            screenshots: screenshotsList,
            img: imgPath
        }

        App.findOneAndUpdate(id, appScrennshots, (err, appDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                appDB
            })
        })

    })

})

// Exporting routes
module.exports = app