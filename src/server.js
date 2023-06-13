const express = require('express');
const helmet = require('helmet');
const config = require('./config/config');

const app = express();
// Routes
const router = require('./router/router');

app.use(express.json());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https: 'unsafe-inline'"],
      connectSrc: ["'self'"],
      'img-src': ["'self'", 'https: data:'],
      upgradeInsecureRequests: [],
    },
  },
}));
app.use(`/api/${config.app.API_VERSION}`, router);

module.exports = app;
