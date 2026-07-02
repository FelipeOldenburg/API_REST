const crud = require('./crudController');
const Cliente = require('../models/clienteModel');

module.exports = crud(Cliente);
