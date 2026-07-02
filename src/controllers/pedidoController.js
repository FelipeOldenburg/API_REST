const crud = require('./crudController');
const Pedido = require('../models/pedidoModel');

module.exports = crud(Pedido);
