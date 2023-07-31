const { getTransactions, createTransaction, getByIdTransactions } = require('../controllers/transactionController')

const router = require('express').Router()

router.get('/:id', getByIdTransactions)
router.get('/', getTransactions)
router.post('/', createTransaction)


module.exports = router