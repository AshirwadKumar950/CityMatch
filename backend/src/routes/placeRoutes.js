const express = require("express");
const { searchPlaces } = require("../controllers/placeController");

const router = express.Router();

router.post("/search", searchPlaces);

module.exports = router;
