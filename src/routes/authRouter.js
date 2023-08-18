const { signIn, signUp } = require("../controllers/userController");
const router = require("express").Router();

router.post("/signup", signUp);
router.post("/signin", signIn);

module.exports = router;
