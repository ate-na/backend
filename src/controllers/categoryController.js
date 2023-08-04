const Category = require("../models/categoryModel");

exports.createCategory = async (req, res, next) => {
  console.log(req.body)
  const title = req.body?.title;
  const type = req.body?.type;
  const icon = req.body?.icon
  if (!title) {
    return res.json({ data: "title is required", status: 402 })

  }
  if (!type) {
    return res.json({ data: "type is required", status: 402 })

  }

  const isExist = await Category.findOne({ title: title });
  if (isExist) {
    return res.json({ data: "category already exist", status: 402 })
  }

  try {
    const category = await Category.create({ title, type, icon });
    return res.json({ data: category, status: 201 });

  } catch (error) {
    return res.json({ data: "error", status: 500 })

  }
};

exports.getCategories = async (req, res, next) => {
  const categories = await Category.find().select('-__v');
  return res.json({ data: categories, status: 200 })
};


