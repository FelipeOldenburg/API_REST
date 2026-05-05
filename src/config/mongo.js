const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

module.exports = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("Mongo conectado");
};