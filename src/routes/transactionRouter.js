const { getTransactions, createTransaction, getByIdTransactions, deleteTransactionById, getTotalAmount } = require('../controllers/transactionController')

const router = require('express').Router()

router.get('/total', getTotalAmount)
router.get('/:id', getByIdTransactions)
router.get('/', getTransactions)
router.post('/', createTransaction)
router.delete('/:id', deleteTransactionById)


module.exports = router