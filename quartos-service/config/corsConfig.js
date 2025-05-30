'use strict'; 
const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:8081'], 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

module.exports = cors(corsOptions);