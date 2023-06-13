const express = require('express');
const controller = require('../controllers/controller');
const md = require('../middlewares/middleware');

const api = express.Router();

api
  .get('/', [md.middleware], controller.helloWorld);

module.exports = api;
