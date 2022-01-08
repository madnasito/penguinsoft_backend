const path = require('path')

const appFileName = (fileName, name, version, res) => {

    if (!name || !version) {
        return res.status(400).json({
            err: {
                message: 'Error in name or App Version'
            }
        })
    }

    let validExtensions = ['png', 'appimage']
    let cutName = fileName.split('.')
    let extension = cutName[cutName.length - 1]

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(200).json({
            ok: false,
            err: {
                message: 'Valid Extensions are: ' + validExtensions.join(', '),
                extension
            }
        })
    }

    return `${name} (${version}).${extension}`
}

const appPath = (userId, id) => path.resolve(__dirname, `../../user/${userId}/apps/${id}`)

const verifyImage = (imageFile, res) => {

    if (!imageFile) {
        return res.status(400).json({
            err: {
                message: 'Error at uploading Image'
            }
        })
    }

    let validExtensions = ['png', 'jpg', 'jpeg']
    let cutName = imageFile.name.split('.')
    let extension = cutName[cutName.length - 1]

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(200).json({
            ok: false,
            err: {
                message: 'Valid extensions are: ' + validExtensions.join(', '),
                extension
            }
        })
    }

    return imageFile.name
}

const verifyScreenshoots = (screenshots, path, res) => {

    if (!screenshots) {
        return []
    }

    let list = []

    screenshots.forEach(element => {
        let fileName = element.name
        let cutName = fileName.split('.')
        let extension = cutName[cutName.length - 1]
        let validExtensions = ['png', 'jpg', 'gif', 'jpeg', 'mp4', 'avi', 'mkv']

        // Verify Screenshots Extension
        if (validExtensions.indexOf(extension) < 0) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Valid extensions are: ' + validExtensions.join(', ')
                }
            })
        }

        list.push(`${path}/${element.name}`)

    });
    return list
}


module.exports = {
    appFileName,
    appPath,
    verifyImage,
    verifyScreenshoots
}