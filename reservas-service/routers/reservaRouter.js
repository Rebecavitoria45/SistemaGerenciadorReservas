const express = require('express')
const router = express.Router();
const reservaController = require('../controllers/reservasController')

router.post('/cadastrar', reservaController.criarReserva)
router.delete('/:id_reserva', reservaController.excluir_reserva)
router.get('/listar', reservaController.listarReservas)
router.get('/reservasusuario/:usuario_id', reservaController.listarReservasPorUsuario)
router.put('/:id_reserva', reservaController.atualizarReserva)
router.get('/:id_reserva',reservaController.buscarReservaPorId)

module.exports = router;