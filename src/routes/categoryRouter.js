const router = require("express").Router();
const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");

router.get("/", getCategories);
router.post("/", createCategory);

module.exports = router;
