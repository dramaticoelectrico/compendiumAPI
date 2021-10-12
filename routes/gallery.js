const express = require("express");
const router = express.Router();
const auth = require("../helpers/jwtValidate");

const adminController = require("../controllers/admin");

const multer = require("multer");
var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, new Date().toISOString() + file.originalname);
  },
});
var upload = multer({ storage: storage });

// add Image
router.post(
  "/admin/upload",
  auth,
  upload.single("image"),
  adminController.postImageUpload
);
// add entry
router.post("/admin/create", auth, adminController.postFormData);
// update data
router.post(
  "/admin/edit",
  auth,
  upload.single("image"),
  adminController.postFormEdit
);
// delete data
router.post("/admin/delete", auth, adminController.postFormDelete);

module.exports = router;
