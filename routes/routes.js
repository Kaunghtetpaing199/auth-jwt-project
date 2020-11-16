const express = require("express");

const router = express.Router();
const authConroller = require("../controllers/authConroller");
const { requireAuth, checkUser } = require("../middlewares/authmiddleware");

router.get("*", checkUser);
router.get("/", authConroller.home);

router.get("/smoothies", requireAuth, authConroller.smoothies);

router.get("/signup", authConroller.singup_get);
router.post("/signup", authConroller.singup_post);

router.get("/login", authConroller.login_get);
router.post("/login", authConroller.login_post);

router.get("/logout", authConroller.logout_get);

module.exports = router;
