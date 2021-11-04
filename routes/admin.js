const express = require("express");
const router = express.Router();
const multer = require("multer");
const adminController = require("../controllers/admin");
const { auth } = require("../helpers/jwtValidate");

var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, new Date().toISOString() + file.originalname);
  },
});
var upload = multer({ storage: storage });

// add Image
router.post(
  "/api/v1/admin/image",
  auth,
  upload.single("image"),
  adminController.postImageUpload
);
// add entry
router.post("/api/v1/admin", auth, adminController.postFormData);
// update data
router.put(
  "/api/v1/admin/edit/:id",
  auth,
  upload.single("image"),
  adminController.postFormEdit
);
// delete data
router.post("/api/v1/admin/delete/:id", auth, adminController.postFormDelete);

module.exports = router;
