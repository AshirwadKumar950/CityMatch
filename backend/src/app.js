const express = require("express"); // Converts incoming JSON request → JS object
const cors = require("cors"); // allow frontend to call backend
const userRoutes = require("./routes/userRoutes");
const placeRoutes = require("./routes/placeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "CityMatch backend is running" });
});

app.use("/api/users", userRoutes);
// app.use("/api/places", placeRoutes);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Something went wrong" });
});

app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

module.exports = app;
