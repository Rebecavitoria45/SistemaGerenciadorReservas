const express = require('express')
const router = express.Router();
const quartoController = require('../controllers/quartoController')

router.post('/cadastrar', quartoController.cadastrarQuarto)
router.put('/:usuario_id',quartoController.atualizarQuarto)
router.delete('/:usuario_id',quartoController.deletarQuarto)
router.get('/listar',quartoController.listarQuartos)


module.exports = router;