const express = require('express')
const router = express.Router();
const quartoController = require('../controllers/quartoController')
const verificaToken = require('../middleware/verificartoken')

router.post('/cadastrar', verificaToken,quartoController.cadastrarQuarto)
router.put('/atualizar/:numero_quarto',verificaToken,quartoController.atualizarQuarto)
router.delete('/deletar/:numero_quarto',verificaToken,quartoController.deletarQuarto)
router.get('/listar',verificaToken,quartoController.listarQuartos)
router.get('/buscar/:numero_quarto',verificaToken, quartoController.buscarQuarto)

module.exports = router;