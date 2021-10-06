const mongoose = require("mongoose");
// image, title, fstop, iso, camera, shutterSpeed, lens, publish, alt
const Gallery = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 6,
  },
  alt: {
    type: String,
    required: true,
    min: 6,
  },
  fstop: {
    type: String,
    default: "Global",
  },
  camera: {
    type: String,
    default: "Global",
  },
  lens: {
    type: String,
    default: "Global",
  },
  iso: {
    type: String,
    default: "Global",
  },
  shutterSpeed: {
    type: String,
    default: "Global",
  },
  publish: {
    type: Boolean,
    default: false,
  },
  image: {
    secure_url: String,
    public_id: String,
    width: Number,
    height: Number,
    breakpoints: [
      {
        secure_url: String,
        width: Number,
        height: Number,
      },
    ],
  },
});
module.exports = mongoose.model("Gallery", Gallery);
