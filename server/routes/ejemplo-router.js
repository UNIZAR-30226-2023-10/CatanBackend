const express = require('express')

const EjemploCtrl = require('../controllers/ejemplo-ctrl')

const router = express.Router()

router.post('/ejemplo', EjemploCtrl.insertarEjemplo)
router.put('/ejemplo/:id', EjemploCtrl.modificarEjemplo)
router.delete('/ejemplo/:id', EjemploCtrl.eliminarEjemplo)
router.get('/ejemplo/:id', EjemploCtrl.obtenerEjemploConId)
router.get('/ejemplo', EjemploCtrl.obtenerEjemplos)

module.exports = router