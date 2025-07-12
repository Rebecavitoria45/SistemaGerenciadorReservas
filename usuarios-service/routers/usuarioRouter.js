const express = require('express')
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController')
const verificaToken = require('../middleware/verificartoken')
const verificarRole = require('../middleware/Verificarrole')

router.post('/cadastrar' ,usuarioController.cadastrarUsuario)
router.post('/login', usuarioController.loginUsuario)
router.put('/atualizar/:usuario_id',verificaToken,usuarioController.atualizarUsuario)
router.delete('/deletar/:usuario_id',verificaToken, verificarRole(['admin']),usuarioController.deletarUsuario)
router.get('/listar',verificaToken,usuarioController.listarUsuarios)
router.get('/buscar/:usuario_id',verificaToken, usuarioController.buscarUsuario)


module.exports = router;