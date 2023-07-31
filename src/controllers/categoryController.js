const Category = require("../models/categoryModel");

exports.createCategory = async (req, res, next) => {
  const title = req.body?.title;
  const type = req.body?.type;
  const icon = req.body?.icon
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
    const category = await Category.create({ title, type, icon });
    return res.json({ data: category, status: 201 });

  } catch (error) {
    return res.json({ data: "error", status: 500 })

  }
};

exports.getCategories = async (req, res, next) => {
  const categories = await Category.find();
  console.log(categories);
  return res.json({ data: categories, status: 200 })
};
