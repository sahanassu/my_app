const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number
});

module.exports = mongoose.model('Item', ItemSchema);
