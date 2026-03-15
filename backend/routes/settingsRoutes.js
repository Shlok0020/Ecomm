const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {

  res.json({
    success: true,
    siteName: "New Prem Glass",
    currency: "INR"
  });

});

module.exports = router;