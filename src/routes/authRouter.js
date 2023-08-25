const {
  signIn,
  signUp,
  changePassword,
  authentication,
} = require("../controllers/userController");
const router = require("express").Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.patch("/change-password/:id", authentication, changePassword);

module.exports = router;
