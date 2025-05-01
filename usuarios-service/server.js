const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Rota de usuario OK!' });
});

app.listen(3000, () => {
  console.log('Reserva service rodando na porta 3000');
});