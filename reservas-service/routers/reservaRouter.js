const express = require('express')
const router = express.Router();
const reservaController = require('../controllers/reservasController')
const verificaToken = require('../middleware/verificartoken')

router.post('/cadastrar', verificaToken,reservaController.criarReserva)
router.delete('/deletar/:id_reserva', verificaToken,reservaController.excluir_reserva)
router.get('/listar', verificaToken,reservaController.listarReservas)
router.get('/reservasusuario/:usuario_id',verificaToken, reservaController.listarReservasPorUsuario)
router.put('/atualizar/:id_reserva',verificaToken, reservaController.atualizarReserva)
router.get('/buscarreserva/:id_reserva',verificaToken,reservaController.buscarReservaPorId)

module.exports = router;