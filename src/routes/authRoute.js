const {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
  deleteAccount,
} = require("../controllers/auth.controllers.js");
const verifyJWT = require("../middleware/verifyToken.js");

const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.delete("/delete-account", verifyJWT, deleteAccount);
router.get("/check", verifyJWT, checkAuth);
router.put("/update-profile", verifyJWT, updateProfile);

module.exports = router;
