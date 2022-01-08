const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const fs = require('fs')
const User = require('../models/user')
const App = require('../models/app')
const { verifyToken } = require('../middlewares/autentication')
const { appFileName, appPath, verifyImage, verifyScreenshoots } = require('../middlewares/upload_validation')

// Default options
// app.use(fileUpload())

app.post('/upload/app', verifyToken, async(req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.json({
            ok: false,
            err: {
                message: "Error en el archivo"
            }
        })
    }

    let file = req.files.app
    let body = req.body
    let fileName = await appFileName(req.files.app.name, body.name, body.version, res)
    let path
    let img = req.files.img
    let imgName = await verifyImage(img, res)
    let screenshots = req.files.screenshots

    let app = new App({
        publisher: req.user.publisher,
        name: body.name,
        user: req.user._id,
        version: body.version,
        code: body.code,
        updated: Date()
    })

    app.save((err, appDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        path = appPath(req.user._id, appDB._id)
        fs.mkdirSync(path)
        file.mv(`${path}/${fileName}`, (err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            img.mv(`${path}/${imgName}`)
            list = verifyScreenshoots(screenshots, path, res)
            insertToApp(`${path}/${fileName}`, `${path}/${imgName}`, list, appDB, res)
        })

        insertAppUser(req.user._id, appDB._id, res)

        res.json({
            ok: true,
            appDB
        })

    })

})


const insertAppUser = async(userId, appId, res) => {

    let appNew = await User.findOne({ _id: userId }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        return userDB
    })

    appNew.apps.push(appId)

    User.findByIdAndUpdate(userId, { apps: appNew.apps }, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

    })

}

const insertToApp = async(file, img, screenshots, appDB, res) => {

    let finalApp = {
        img: img,
        screenshots: screenshots,
        file: file
    }

    await App.findByIdAndUpdate(appDB._id, finalApp, (err) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
    })
}


module.exports = app