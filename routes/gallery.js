const express = require("express");
const router = express.Router();
const auth = require("../helpers/jwtValidate");

const adminController = require("../controllers/admin");
const galleryController = require("../controllers/gallery");
const multer = require("multer");
var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, new Date().toISOString() + file.originalname);
  },
});
var upload = multer({ storage: storage });
// Get images
router.get("/api/v1/gallery", galleryController.getGallery);
// add Image
router.post(
  "/api/v1/admin/upload",
  auth,
  upload.single("image"),
  adminController.postImageUpload
);
// add entry
router.post("/api/v1/admin/create", auth, adminController.postFormData);
// update data
router.post(
  "/api/v1/admin/edit",
  auth,
  upload.single("image"),
  adminController.postFormEdit
);
// delete data
router.post("/api/v1/admin/delete", auth, adminController.postFormDelete);

module.exports = router;
