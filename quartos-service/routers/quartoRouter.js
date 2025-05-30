const express = require('express')
const router = express.Router();
const quartoController = require('../controllers/quartoController')

router.post('/cadastrar', quartoController.cadastrarQuarto)
router.put('/atualizar/:numero_quarto',quartoController.atualizarQuarto)
router.delete('/deletar/:numero_quarto',quartoController.deletarQuarto)
router.get('/listar',quartoController.listarQuartos)
router.get('/buscar/:numero_quarto',quartoController.buscarQuarto)

module.exports = router;