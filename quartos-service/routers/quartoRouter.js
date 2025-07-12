const express = require('express')
const router = express.Router();
const quartoController = require('../controllers/quartoController')
const verificaToken = require('../middleware/verificartoken')
const verificarRole = require('../middleware/Verificarrole')

router.post('/cadastrar', verificaToken, verificarRole(['admin']),quartoController.cadastrarQuarto)
router.put('/atualizar/:numero_quarto',verificaToken, verificarRole(['admin']),quartoController.atualizarQuarto)
router.delete('/deletar/:numero_quarto',verificaToken, verificarRole(['admin']),quartoController.deletarQuarto)
router.get('/listar',verificaToken,quartoController.listarQuartos)
router.get('/buscar/:numero_quarto',verificaToken, quartoController.buscarQuarto)

module.exports = router;