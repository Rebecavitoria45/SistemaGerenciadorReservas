const express = require('express');
require('dotenv').config(); 
const sequelize = require('./config/database');
const defineReservaModel = require('./models/reservaModel');

const app = express();
app.use(express.json());

const Reserva = defineReservaModel(sequelize);

// Teste de rota
app.get('/', async (req, res) => {
  const reservas = await Reserva.findAll();
  res.json(reservas);
});

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
