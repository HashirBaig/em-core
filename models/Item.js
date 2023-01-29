const mongoose = require("mongoose")

const ItemSchema = new mongoose.Schema({
  item: {
    type: String,
  },
  amount: {
    type: Number,
  },
  description: {
    type: Number,
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
