const crud = require('./crudController');
const Categoria = require('../models/categoriaModel');

module.exports = crud(Categoria);
