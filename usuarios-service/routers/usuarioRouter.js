const express = require('express')
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController')

router.post('/cadastrar', usuarioController.cadastrarUsuario)
router.post('/login', usuarioController.loginUsuario)
router.put('/:usuario_id',usuarioController.atualizarUsuario)
router.delete('/:usuario_id',usuarioController.deletarUsuario)
router.get('/listar',usuarioController.listarUsuarios)
router.get('/:usuario_id',usuarioController.buscarUsuario)


module.exports = router;