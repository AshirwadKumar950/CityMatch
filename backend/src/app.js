const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const placeRoutes = require("./routes/placeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "CityMatch backend is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/places", placeRoutes);

module.exports = app;
