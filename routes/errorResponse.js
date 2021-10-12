const express = require("express");
const router = express.Router();

router.use((error, req, res, next) => {
  res.status(500).json({
    error,
    success: false,
  });
});

module.exports = router;
