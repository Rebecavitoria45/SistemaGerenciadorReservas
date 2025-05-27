'use strict'; // Adicionado para manter a consistência se outros arquivos usarem

const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:8081'], // CORRIGIDO: Adicionado 8081 ao array de origens permitidas
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

module.exports = cors(corsOptions);