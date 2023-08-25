const router = require("express").Router();
const {
  createCategory,
  getCategories,
  updateCategory,
} = require("../controllers/categoryController");

router.get("/", getCategories);
router.post("/", createCategory);
router.patch("/:id", updateCategory);

module.exports = router;
