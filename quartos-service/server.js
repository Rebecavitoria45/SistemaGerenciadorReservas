const express = require('express');
require('dotenv').config(); 
const sequelize = require('./config/database');
const defineQuartoModel = require('./models/quartoModel');

const app = express();
app.use(express.json());

const Quarto = defineQuartoModel(sequelize);

// Teste de rota
app.get('/', async (req, res) => {
  const quartos = await Quarto.findAll();
  res.json(quartos);
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
        console.log('Quartos service rodando na porta 3000');
      });
    } catch (err) {
      console.log('Banco não disponível, tentando novamente em 5 segundos...');
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

connectWithRetry();