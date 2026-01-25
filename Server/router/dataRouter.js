const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");


router.get("/intensity-year", dataController.intensityByYear);
router.get("/likelihood-country", dataController.likelihoodByCountry);
router.get("/region", dataController.regionDistribution);
router.get("/year-trend", dataController.yearTrend);
router.get("/pestle", dataController.pestleDistribution);
router.get("/swot", dataController.swotAnalysis);
router.get("/sector", dataController.sectorDistribution);
router.get("/topic", dataController.topicDistribution);
router.get("/kpi", dataController.getKPI);

module.exports = router;
