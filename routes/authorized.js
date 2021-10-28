const express = require("express");
const router = express.Router();

const authorizeController = require("../controllers/authorized");

// API JS ENABLED
router.post("/api/v1/auth/signin", authorizeController.apiSignIn);
router.post("/api/v1/auth/register", authorizeController.apiRegister);

module.exports = router;
