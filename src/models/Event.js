const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Event', schema);