const Usuario = require('../models/usuarioModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.cadastrarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, role } = req.body;

        if (!nome) return res.status(422).json({ msg: 'Nome é obrigatório' });
        if (!email) return res.status(422).json({ msg: 'Email é obrigatório' });
        if (!senha) return res.status(422).json({ msg: 'Senha é obrigatória' });

        const usuarioexiste = await Usuario.findOne({ where: { email } });
        if (usuarioexiste) return res.status(422).json({ error: 'Email já cadastrado' });

        // Criando Hash da senha
        let senhaHash;
        try {
            const salt = await bcrypt.genSalt(12);
            senhaHash = await bcrypt.hash(senha, salt);
        } catch (hashError) {
            console.error('Erro ao gerar hash:', hashError);
            return res.status(500).json({ error: 'Erro ao gerar hash da senha' });
        }

        const usuario = await Usuario.create({ nome, email, senha: senhaHash, role});

        res.status(201).json({ msg: 'Usuário cadastrado com sucesso', nome });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar usuário', detalhes: error.message });
    }
};


  exports.loginUsuario = async (req, res) => {
    try {
        const { email, senha, role } = req.body;

        if (!email) return res.status(422).json({ msg: 'Email é obrigatório' });
        if (!senha) return res.status(422).json({ msg: 'Senha é obrigatória' });

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        const checkSenha = await bcrypt.compare(senha, usuario.senha);
        if (!checkSenha) {
            return res.status(401).json({ msg: 'Senha inválida' });
        }

        const secret = process.env.JWTSECRET;
        const token = jwt.sign(
            {
                id: usuario.usuario_id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role 
            },
            secret,
            { expiresIn: '1d' }
        );

        return res.status(200).json({ msg: 'Autenticação com sucesso', token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao autenticar usuário' });
    }
};


        exports.atualizarUsuario = async (req, res) => {
            try {
              const { usuario_id } = req.params; 
              const { nome, email, senha } = req.body;
          
              const usuario = await Usuario.findByPk(usuario_id);
          
              if (!usuario) {
                return res.status(404).json({ msg: 'Usuário não encontrado' });
              }
              if (nome) usuario.nome = nome;
              if (email) usuario.email = email;
               if (senha) {
                 try {
                  const salt = await bcrypt.genSalt(12);
                  usuario.senhaHash = await bcrypt.hash(senha, salt);
                 } catch (hashError) {
                  console.error('Erro ao gerar hash da senha:', hashError);
                  return res.status(500).json({ error: 'Erro ao gerar hash da senha' });
                }
             }

           await usuario.save();
          
              res.status(200).json({ msg: 'Usuário atualizado com sucesso', usuario });
            } catch (error) {
              console.error(error);
              res.status(500).json({ msg: 'Erro ao atualizar usuário' });
            }
          };
          

          exports.deletarUsuario = async (req, res) => {
            try {
              const { usuario_id } = req.params; 
             
              const usuario = await Usuario.findByPk(usuario_id);
          
              if (!usuario) {
                return res.status(404).json({ msg: 'Usuário não encontrado' });
              } 
              await usuario.destroy();
          
              res.status(200).json({ msg: 'Usuário deletado com sucesso', usuario });
            } catch (error) {
              console.error(error);
              res.status(500).json({ msg: 'Erro ao atualizar usuário' });
            }
          };
          
          exports.listarUsuarios = async (req, res) => {
            try {
              const usuarios = await Usuario.findAll({
                attributes: { exclude: ['senha'] }
              });
              res.status(200).json(usuarios);
            } catch (error) {
              console.error('Erro ao listar usuários:', error);
              res.status(500).json({ error: 'Erro ao listar usuários' });
            }
          };

          exports.buscarUsuario = async (req, res) => {
            try {
              const { usuario_id } = req.params; 
          
              const usuario = await Usuario.findByPk(usuario_id);
          
              if (!usuario) {
                return res.status(404).json({ msg: 'Usuário não encontrado' });
              }
              res.status(200).json({ msg: 'Usuário encontrado', usuario });
            } catch (error) {
              console.error(error);
              res.status(500).json({ msg: 'Erro ao Buscar usuário' });
            }
          };
          