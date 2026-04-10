const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
	// console.log("Middleware hit");
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "No token provided" });
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		console.log("TOKEN:", token);
		console.log("DECODED:", decoded);

		req.user = { id: decoded.id };	
		next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

module.exports = {
	protect,
};
