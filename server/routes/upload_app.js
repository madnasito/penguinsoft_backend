const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs')
const path = require('path')
    // const Usuario = require('../models/usuario')
    // const Producto = require('../models/producto')

// default options
app.use(fileUpload());

app.post('/upload/application', function(req, res) {
    console.log(req.files)


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.json({
            ok: false,
            err: {
                message: "Error en el archivo"
            }
        })
    }

    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposValidos = ['usuarios', 'productos'];
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(200).json({
            ok: false,
            err: {
                message: "Los tipos validos son: " + tiposValidos.join(', '),
                tipo
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length - 1]
    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg']

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(200).json({
            ok: false,
            err: {
                message: "Las extensiones validas son: " + extensionesValidas.join(', '),
                extension
            }
        })
    }
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (tipo === "usuarios") {
            imagenUsuario(id, res, nombreArchivo)
        } else {
            imagenProducto(id, res, nombreArchivo)
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, "usuarios")
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, "usuarios")
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El usuario no existe"
                }
            })
        }
        borraArchivo(usuarioDB.img, "usuarios");
        usuarioDB.img = nombreArchivo
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    })
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, "productos")
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            borraArchivo(nombreArchivo, "productos")
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El producto no existe"
                }
            })
        }
        borraArchivo(productoDB.img, "productos");
        productoDB.img = nombreArchivo
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        })
    })
}

function borraArchivo(nombreArchivo, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`)
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen)
    }
}

module.exports = app;