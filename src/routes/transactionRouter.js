const {
  getTransactions,
  createTransaction,
  getByIdTransactions,
  deleteTransactionById,
  getTotalAmount,
  getChartExpenseData,
  TotalReport,
} = require("../controllers/transactionController");
const { authentication } = require("../controllers/userController");

const router = require("express").Router();

router.get("/total/report", authentication, TotalReport);
router.get("/total", authentication, getTotalAmount);
router.get("/chart/:type", authentication, getChartExpenseData);
router.get("/:id", authentication, getByIdTransactions);
router.get("/", authentication, getTransactions);
router.post("/", authentication, createTransaction);
router.delete("/:id", authentication, deleteTransactionById);

module.exports = router;
