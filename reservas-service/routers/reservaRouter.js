const express = require('express')
const router = express.Router();
const reservaController = require('../controllers/reservasController')

router.post('/cadastrar', reservaController.criarReserva)

module.exports = router;