const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

router.get("/stats", dashboardController.getStats);

router.get("/activities", dashboardController.getRecentActivities);

router.get("/charts", dashboardController.getChartData);

router.get("/top-products", dashboardController.getTopProducts);

router.get("/inventory-summary", dashboardController.getInventorySummary);

router.get("/customer-insights", dashboardController.getCustomerInsights);

module.exports = router;