const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/gallery");

// Get images
router.get("/api/v1/gallery/:id", galleryController.getGallery);

module.exports = router;
