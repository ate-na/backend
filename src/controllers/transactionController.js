const Category = require("../models/categoryModel")
const Transaction = require("../models/transacionModel")


exports.createTransaction = async (req, res, next) => {
    const money = req.body?.money
    const date = req.body?.date
    const category = req.body?.category

    if (!money) {
        return res.status(400).json({ message: "money is required" })
    }

    if (!date) {
        return res.status(400).json({ message: "date is required" })
    }
    if (!category) {
        return res.status(400).json({ message: "category is required" })
    }


    const isCategoryExist = await Category.findById(category)
    if (!isCategoryExist) {
        return res.status(400).json({ message: "category is not valid" })
    }

    const transaction = Transaction.create({ money, category, date })

    return res.status(200).json({ data: transaction })

}


exports.getTransactions = async () => {
    const transactions = await Transaction.find({}, {}, { populate: "category" })
    res.status(200).json({ data: transactions })

}


exports.getByIdTransactions = async (req, res, next) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({ data: "id is required" })
    }

    try {
        const transaction = await Transaction.findById(id)
        if (!transaction) {
            return res.status(400).json({ data: "id is not valid" })
        }
        return res.status(200).json({ data: transaction })
    } catch (error) {
        return res.status(500).json({ data: error.message })

    }
}