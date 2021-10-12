require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
// const mongoose = require('mongoose')

// mongoose.connect(
//   process.env.DB_CONNECT,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   () => {
//     console.log('connected to DB')
//   }
// )
const adminController = require("../controllers/admin");

// ROUTS
router.get("/api/v1/gallery", (req, res, nex) => {
  res.send(200);
});
router.post("/api/v1/create", (req, res, nex) => {
  res.send(200);
});
router.post("/api/v1/update", (req, res, nex) => {
  res.send(200);
});
router.post("/api/v1/delete", (req, res, nex) => {
  res.send(200);
});

router.post("/api/v1/upload", adminController.postImageUpload);

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Listening on ${port}`));
