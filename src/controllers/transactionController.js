const Category = require("../models/categoryModel");
const Transaction = require("../models/transacionModel");

exports.createTransaction = async (req, res, next) => {
  const money = req.body?.money;
  const date = req.body?.date;
  const category = req.body?.category;

  console.log(req.body);

  if (!money) {
    return res.status(400).json({ message: "money is required" });
  }

  if (!date) {
    return res.status(400).json({ message: "date is required" });
  }
  if (!category) {
    return res.status(400).json({ message: "category is required" });
  }

  const isCategoryExist = await Category.findById(category);
  if (!isCategoryExist) {
    return res.status(400).json({ message: "category is not valid" });
  }

  const transaction = Transaction.create({
    money: isCategoryExist.type === "Expense" ? money * -1 : money,
    category,
    date,
  });

  return res.status(200).json({ data: transaction });
};

exports.getTransactions = async (req, res, next) => {
  const year = req.query.year;
  const month = req.query.month;
  const dummyDate = new Date(`${month} 1, ${year}`);
  const monthNumber = dummyDate.getMonth() + 1;

  const transactions = await Transaction.aggregate([
    {
      $project: {
        month: { $month: "$date" },
        year: { $year: "$date" },
        category: 1,
        money: 1,
        date: 1,
      },
    },

    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$month", monthNumber] }, // 8 for August
            { $eq: ["$year", +year] }, // 2023 for the year
          ],
        },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $project: {
        category: { $arrayElemAt: ["$category", 0] },
        money: 1,
        date: 1,
      },
    },
  ]);
  console.log("transactions", transactions);
  res.status(200).json({ data: transactions });
};

exports.getByIdTransactions = async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ data: "id is required" });
  }

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(400).json({ data: "id is not valid" });
    }
    return res.status(200).json({ data: transaction });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

exports.getTotalAmount = async (req, res, next) => {
  const expense = await Transaction.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $project: {
        category: { $arrayElemAt: ["$category", 0] },
        money: 1,
        date: 1,
      },
    },
    {
      $group: {
        _id: "$category.type",
        totalAmount: { $sum: "$money" },
      },
    },
  ]);
  res.json({ data: expense[0]?.totalAmount + expense[1]?.totalAmount });
};

exports.deleteTransactionById = async (req, res, next) => {
  const id = req.params.id;
  const trx = await Transaction.findByIdAndDelete(id);
  res.json({ data: "delete successfully" });
};

exports.getChartExpenseData = async (req, res, next) => {
  const type = req.params.type;
  let year;
  let month;
  if (req.query.year) {
    year = req.query.year;
  } else {
    year = new Date().getFullYear();
  }
  if (req.query.month) {
    month = req.query.month;
  } else {
    month = new Date().getMonth();
  }
  const dummyDate = new Date(`${month} 1, ${year}`);
  const monthNumber = dummyDate.getMonth() + 1;
  if (type !== "Expense" && type !== "Income") {
    res.status(402).json({ data: "type is not correct" });
  }

  const totalAmountResult = await Transaction.aggregate([
    {
      $project: {
        month: { $month: "$date" },
        year: { $year: "$date" },
        category: 1,
        money: 1,
        date: 1,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $project: {
        month: 1,
        year: 1,
        money: 1,
        category: { $arrayElemAt: ["$category", 0] },
      },
    },
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$month", monthNumber] }, // 8 for August
            { $eq: ["$year", +year] }, // 2023 for the year
            { $eq: ["$category.type", type] },
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$money" },
      },
    },
  ]);
  const totalAmount = totalAmountResult[0]?.totalAmount || 0;
  const x = await Transaction.aggregate([
    {
      $project: {
        month: { $month: "$date" },
        year: { $year: "$date" },
        category: 1,
        money: 1,
        date: 1,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $project: {
        month: 1,
        year: 1,
        money: 1,
        category: { $arrayElemAt: ["$category", 0] },
      },
    },
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$month", monthNumber] }, // 8 for August
            { $eq: ["$year", +year] }, // 2023 for the year
            { $eq: ["$category.type", type] },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$category._id",
        data: { $push: "$category" },
        totalAmount: { $sum: "$money" },
      },
    },
    {
      $project: {
        value: {
          $multiply: [{ $divide: ["$totalAmount", totalAmount] }, 100],
        },
        category: { $arrayElemAt: ["$data", 0] },
      },
    },
    {
      $project: {
        _id: 0,
        value: 1,
        label: "$category.title",
      },
    },
  ]);
  res.json({ data: x });
};

exports.TotalReport = async (req, res, next) => {
  const year = req.query.year;
  const month = req.query.month;
  const dummyDate = new Date(`${month} 1, ${year}`);
  const monthNumber = dummyDate.getMonth() + 1;
  const total = await Transaction.aggregate([
    {
      $project: {
        month: { $month: "$date" },
        year: { $year: "$date" },
        category: 1,
        money: 1,
        date: 1,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$month", monthNumber] }, // 8 for August
            { $eq: ["$year", +year] }, // 2023 for the year
          ],
        },
      },
    },
    {
      $group: {
        _id: "$category.type",
        amount: { $sum: "$money" },
      },
    },
    {
      $project: {
        _id: 0,
        type: { $arrayElemAt: ["$_id", 0] },
        amount: 1,
      },
    },
  ]);

  res.json({ data: total });
};
