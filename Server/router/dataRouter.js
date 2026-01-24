const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController")

router.get("/lineChart" , dataController.datafetch )


module.exports = router