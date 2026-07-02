const crud = require('./crudController');
const Produto = require('../models/produtoModel');

module.exports = crud(Produto);
