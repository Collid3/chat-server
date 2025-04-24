const {
  getUsers,
  getMessages,
  sendMessage,
} = require("../controllers/message.controller");
const verifyJWT = require("../middleware/verifyToken");

const router = require("express").Router();

router.get("/users", verifyJWT, getUsers);
router.get("/:id", verifyJWT, getMessages);
router.post("/send/:id", verifyJWT, sendMessage);

module.exports = router;
