
const express = require("express");
const rooms= require('../routes/room');

require("express-async-errors");



module.exports = function (app) {
  app.use(express.json());
 
  app.use('/api/room',rooms);
};