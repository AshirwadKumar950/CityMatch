const express = require("express");
const {
	registerUser,
	loginUser,
	getUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
// console.log("User routes loaded"); // Debugging log
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;
