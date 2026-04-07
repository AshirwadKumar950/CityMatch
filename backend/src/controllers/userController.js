const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
	createUser,
	findUserByEmail,
	findUserById,
} = require("../models/userModel");

const createToken = (userId) => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debugging log
const registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const existingUser = await findUserByEmail(email);
		if (existingUser) {
			return res.status(409).json({ message: "User already exists" });
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const user = await createUser({ name, email, passwordHash });
		const token = createToken(user.id);

		const safeUser = {
			id: user.id,
			name: user.name,
			email: user.email,
		};
		console.log("User created:", user);
		return res.status(201).json({
			message: "User registered successfully",
			token,
			user: safeUser,
		});
	} catch (error) {
		console.error("REGISTER ERROR:", error);
		return res.status(500).json({ message: "Server error", error: error.message });
	}
};

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required" });
		}

		const user = await findUserByEmail(email);
		if (!user) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
		if (!isPasswordCorrect) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		const token = createToken(user.id);

		return res.status(200).json({
			message: "Login successful",
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				created_at: user.created_at,
			},
		});
	} catch (error) {
		return res.status(500).json({ message: "Server error", error: error.message });
	}
};

const getUserProfile = async (req, res) => {
	try {
		const user = await findUserById(req.user.id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const safeUser = {
			id: user.id,
			name: user.name,
			email: user.email,
			created_at: user.created_at,
		};

		return res.status(200).json({ user: safeUser });
	} catch (error) {
		return res.status(500).json({ message: "Server error", error: error.message });
	}
};

module.exports = {
	registerUser,
	loginUser,
	getUserProfile,
};
