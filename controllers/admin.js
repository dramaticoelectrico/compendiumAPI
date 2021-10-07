const app = express();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const imageDataFormat = require("../helpers/imageDataFormat");
const Gallery = require("../models/gallery");
// image, title, fstop, iso, camera, shutterSpeed, lens, publish, alt
const UPLOADS = [
  "image/jpeg",
  "image/gif",
  "image/WebP",
  "image/SVG",
  "image/WDP",
];
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
exports.postFormData = async (req, res, next) => {
  const { image, title, fstop, iso, camera, shutterSpeed, lens, publish, alt } =
    req.body;
  try {
    const newEntry = {
      image,
      title,
      fstop,
      iso,
      camera,
      shutterSpeed,
      lens,
      publish,
      alt,
    };
    const gallery = new Gallery(newEntry);
    await gallery.save();
    res.status(200).json({ success: true, gallery });
  } catch (error) {
    next(error);
  }
};
exports.postFormEdit = async (req, res, next) => {
  const {
    galleryId,
    title,
    fstop,
    iso,
    camera,
    shutterSpeed,
    lens,
    image,
    alt,
    publish,
  } = req.body;

  try {
    const gallery = await Gallery.findById(galleryId);
    gallery.title = title;
    gallery.fstop = fstop;
    gallery.iso = iso;
    gallery.camera = camera;
    gallery.shutterSpeed = shutterSpeed;
    gallery.lens = lens;
    gallery.fstop = fstop;
    gallery.image = image;
    gallery.alt = alt;
    gallery.publish = publish;

    await gallery.save();
    res
      .status(200)
      .json({ success: true, message: "success image updated", gallery });
  } catch (error) {
    next(error);
  }
};
exports.postFormDelete = async (req, res, next) => {
  const id = req.body.galleryId;
  const imageId = req.body.imageId;

  try {
    if (imageId) {
      await cloudinary.uploader.destroy(imageId, callbackCloudinary);
    }
    await Gallery.deleteOne({ _id: id });
    res.status(200).json({ success: true, message: "success deleted" });
  } catch (error) {
    next(error);
  }
};
exports.postImageUpload = async (req, res, next) => {
  const { mimetype, tempFilePath, md5 } = req.files.image;
  if (!tempFilePath || !UPLOADS.includes(mimetype)) {
    res.status(422).json({
      success: false,
      message: "No file attached or wrong image format",
    });
    next();
  }
  cloudinary.uploader.upload(
    tempFilePath,
    {
      responsive_breakpoints: [
        {
          create_derived: false,
          bytes_step: 20000,
          min_width: 200,
          max_width: 1200,
          max_images: 4,
        },
      ],
      public_id: md5,
    },
    function (error, result) {
      if (error) {
        res
          .status(500)
          .json({ error, success: false, message: "Error in upload" });
        next(error);
      }

      const image = imageDataFormat(result);
      res.status(200).json({
        success: true,
        message: "file uploaded",
        data: image,
      });
    }
  );
};

// ADMIN LOGIN
