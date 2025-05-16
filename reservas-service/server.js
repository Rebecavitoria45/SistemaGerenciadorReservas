const express = require('express');
require('dotenv').config(); 
const sequelize = require('./config/database');
const Reserva = require('./models/reservaModel');
const reservaRouter = require('./routers/reservaRouter')
module.exports = {Reserva};

const app = express();
app.use(express.json());

app.use(reservaRouter)

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
        console.log('Reservas service rodando na porta 3000');
      });
    } catch (err) {
      console.log('Banco não disponível, tentando novamente em 5 segundos...');
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

connectWithRetry();
