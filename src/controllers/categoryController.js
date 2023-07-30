const Category = require("../models/categoryModel");

exports.createCategory = async (req, res, next) => {
  const title = req.body.title;
  const type = req.body.type;
  if (!title) {
    throw new Error("title is required");
  }
  if (!type) {
    throw new Error("type is required");
  }

  const isExist = await Category.findOne({ title: title });
  if (isExist) {
    throw new Error("this category already exist");
  }

  try {
    const category = await Category.create({ title: title, type: type });
    return { data: category, status: 201 };
  } catch (error) {
    return { data: "error", status: 500 };
  }
};

exports.getCategories = async () => {
  const categories = await Category.find();
  return { data: categories, status: 200 };
};
