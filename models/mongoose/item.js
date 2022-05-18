/* Define the MongoDB's Schema and model */
const mongoose = require('mongoose');

// Define Schema
const ItemSchema = mongoose.Schema(
  {
    sku: { type: Number, require: true, index: { unique: true } },
    name: { type: String, require: true },
    price: { type: Number, require: true },
  },
  {
    //   hold the time when it was created and hold the time when it was updated
    timestamps: true,
  }
);

// Finally export Shchema, so the other file can used it.
module.exports = mongoose.model('Item', ItemSchema);
