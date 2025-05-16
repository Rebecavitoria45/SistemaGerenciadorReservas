const Usuario = require('../models/usuarioModel')

require('dotenv').config();

exports.cadastrarUsuario = async(req,res)=>{
    try{
            const  {nome,email, senha} = req.body;
    
            if(!nome) return res.status(422).json({msg:'Nome é obrigatório'})
            if(!email) return res.status(422).json({msg:'Email é obrigatório'})   
            if(!senha) return res.status(422).json({msg:'senha é obrigatório'})
            
            const usuarioexiste = await Usuario.findOne({where: {email: req.body.email}})
            if(usuarioexiste) return   res.status(422).json({ error: 'Email já cadastrado' });
    
            const usuario = await Usuario.create({nome,email,senha})
            res.status(201).json({msg:'Usuário cadastrado:', nome});
    }
    catch(error){
        res.status(500).json({error:'error ao cadastrar usuario'})
    }
    };

    exports.loginUsuario = async(req,res)=>{
        try{
               const  {email, senha} = req.body;
    
               if(!email) return res.status(422).json({msg:'Email é obrigatório'})
               if(!senha) return res.status(422).json({msg:'senha é obrigatório'})
        
               const usuario = await Usuario.findOne({ where: { email } });

               if(!usuario){
                return res.status(404).json({msg:'Usuário não encontrado'})
               } 
    
               if(senha !== usuario.senha){
                return res.status(422).json({msg:'Senha inválida'})
               }
    
               res.status(200).json({msg:'Autenticação com sucesso'})
        }
        catch(error){
           
                console.error(error); // <- adicione isso
                res.status(500).json({ error: 'Erro ao encontrar usuário' });
            }
            
            res.status(500).json({error:'error ao encontrar usuario'})
        
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
              if (senha) usuario.senha = senha; 
          
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
          