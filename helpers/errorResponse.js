const express = require("express");
const router = express.Router();

router.use((error, req, res, next) => {
  res.status(400).json({
    error,
    success: false,
  });
});

module.exports = router;
