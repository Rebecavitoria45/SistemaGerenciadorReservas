'use strict';
const cors = require('cors');

const frontendUrls = process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(',') : [];

const corsOptions = {
  origin: frontendUrls.length > 0 ? frontendUrls : ['http://localhost:8080'], 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

module.exports = cors(corsOptions);