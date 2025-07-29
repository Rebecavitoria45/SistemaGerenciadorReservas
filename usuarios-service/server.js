const express = require('express');
require('dotenv').config();
const cors = require('cors');

const sequelize = require('./config/database');
const Usuario = require('./models/usuarioModel');
const usuarioRouter = require('./routers/usuarioRouter')

module.exports = {Usuario};

const app = express();

const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map(url => url.trim())
  : [];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


app.use(express.json());
app.use(usuarioRouter)
async function criarUsuarioPadrao() {
  const usuarioExistente = await Usuario.findOne({
    where: { email: 'admin@admin.com' }
  });

  if (!usuarioExistente) {
    const bcrypt = require('bcryptjs');
    const senhaHash = await bcrypt.hash('admin123', 10);

    await Usuario.create({
      nome: 'Administrador',
      email: 'admin@admin.com',
      senha: senhaHash,
      role: 'admin'
    });

    console.log('Usuário admin padrão criado com sucesso!');
  } else {
    console.log('Usuário admin já existe.');
  }
}


async function connectWithRetry() {
  let connected = false;
  while (!connected) {
    try {
      await sequelize.authenticate();
      console.log('Conectado ao banco com sucesso!');
      connected = true;
      await sequelize.sync();

      // Criação do usuário padrão
      await criarUsuarioPadrao();

      app.listen(3000, () => {
        console.log('Usuarios service rodando na porta 3000');
      });
    } catch (err) {
      console.log('Banco não disponível, tentando novamente em 5 segundos...');
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

connectWithRetry();