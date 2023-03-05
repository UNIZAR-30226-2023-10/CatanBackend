/*
    Contiene las operaciones necesarias para manipular un esquema de la base 
    de datos
*/

const Ejemplo = require('../models/ejemplo-model')

insertarEjemplo = (req, res) => {
    const body = req.body

    /* No se provee nada con la petición */
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Debes añadir una entrada a insertar',
        })
    }

    const ejemplo = new Ejemplo(body)

    /* No logra crear una clase Ejemplo */
    if (!ejemplo) {
        return res.status(400).json({
            success: false,
            error: 'No se ha logrado crear tu entrada'
        })
    }

    ejemplo.save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: ejemplo._id,
                message: 'Entrada de ejemplo creada',
            }).catch(error => {
                return res.status(400).json({
                    error,
                    message: 'No se ha podido insertar tu entrada',
                })
            })
        })
}

modificarEjemplo = async (req, res) => {
    const body = req.body

    /* No se provee nada con la petición */
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Debes añadir una entrada a modificar',
        })
    }

    Ejemplo.findOne({ _id: req.params.id }, (err, ejemplo) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Entrada a modificar no encontrada',
            })
        }

        // Actualiza entrada obtenida
        ejemplo.nombre = body.nombre
        ejemplo.numero = body.numero

        ejemplo.save().then(() => {
            return res.status(200).json({
                success: true,
                id: ejemplo._id,
                message: 'Entrada de ejemplo modificada',
            }).catch(error => {
                return res.status(400).json({
                    error,
                    message: 'No se ha podido modificar tu entrada',
                })
            })
        })
    })
}

eliminarEjemplo = async (req, res) => {
    await Ejemplo.findOneAndDelete({ _id: req.params.id }, (err, ejemplo) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err,
            })
        }

        if (!ejemplo) {
            return res.status(404).json({
                success: false,
                error: `Ejemplo no encontrado`,
            })
        }

        return res.status(200).json({
            success: true,
            data: ejemplo,
        })
    }).catch(err => console.log(err))
}

obtenerEjemploConId = async (req, res) => {
    await Ejemplo.findOne({ _id: req.params.id }, (err, ejemplo) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }

        if (!ejemplo) {
            return res
                .status(404)
                .json({
                    success: false,
                    error: `Ejemplo no encontrado`
                })
        }
        return res.status(200).json({
            success: true,
            data: ejemplo
        })
    }).catch(err => console.log(err))
}

obtenerEjemplos = async (req, res) => {
    await Ejemplo.find({}, (err, ejemplo) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }
        if (!ejemplo.length) {
            return res
                .status(404)
                .json({
                    success: false,
                    error: `No hay ejemplos en la base`
                })
        }
        return res.status(200).json({
            success: true,
            data: movies
        })
    }).catch(err => console.log(err))
}

module.exports = {
    insertarEjemplo,
    modificarEjemplo,
    eliminarEjemplo,
    obtenerEjemploConId,
    obtenerEjemplos
}