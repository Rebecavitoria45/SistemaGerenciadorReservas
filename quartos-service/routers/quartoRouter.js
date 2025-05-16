const express = require('express')
const router = express.Router();
const quartoController = require('../controllers/quartoController')

router.post('/cadastrar', quartoController.cadastrarQuarto)
router.put('/:numero_quarto',quartoController.atualizarQuarto)
router.delete('/:numero_quarto',quartoController.deletarQuarto)
router.get('/listar',quartoController.listarQuartos)
router.get('/:numero_quarto',quartoController.buscarQuarto)

module.exports = router;