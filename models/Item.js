const mongoose = require("mongoose")

const ItemSchema = new mongoose.Schema({
  item: {
    type: String,
  },
  amount: {
    type: Number,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("item", ItemSchema)
