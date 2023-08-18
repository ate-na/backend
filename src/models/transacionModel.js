const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  money: { type: Number, required: true, default: 0 },
  date: { type: Date, required: true, default: new Date() },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
