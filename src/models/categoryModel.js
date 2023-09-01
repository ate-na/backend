const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  type: { type: String, enum: ["Expense", "Income"], required: true },
  icon: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
