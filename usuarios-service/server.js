const express = require('express');
require('dotenv').config();
const cors = require('cors');

const sequelize = require('./config/database');
const Usuario = require('./models/usuarioModel');
const usuarioRouter = require('./routers/usuarioRouter')

module.exports = {Usuario};

const app = express();

app.use(cors({
  // Mude para um array para permitir múltiplas origens
  origin: ['http://localhost:8080', 'http://localhost:8081'], 
  credentials: true
}));

app.use(express.json());
app.use(usuarioRouter)

// Função para tentar conectar repetidamente
async function connectWithRetry() {
  let connected = false;
  while (!connected) {
    try {
      await sequelize.authenticate();
      console.log('Conectado ao banco com sucesso!');
      connected = true;
      await sequelize.sync();
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