const app = express();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const imageDataFormat = require("../helpers/imageDataFormat");
// image, title, fstop, iso, shutterSpeed, lens, alt
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
  const { image, title, fstop, iso, shutterSpeed, lens, alt } = req.body;
  try {
    const newEntry = { image, title, fstop, iso, shutterSpeed, lens, alt };
    const gallery = new Gallery(newEntry);
    await gallery.save();
    res.status(200).send({ success: true, gallery });
  } catch (error) {
    next(error);
  }
};
exports.postFormEdit = async (req, res, next) => {
  let updatedImage;
  const { galleryId, title, description, tag, publish } = req.body;
  if (req.file) {
    // call cloudinary
    try {
      const imageResponse = await cloudinary.uploader.upload(
        req.file.path,
        Config.imageSettings,
        callbackCloudinary
      );
      updatedImage = formatImageData(imageResponse);
    } catch (error) {
      next(error);
    }
  }
  try {
    // const gallery = await Gallery.findById(galleryId);
    // gallery.title = title;
    // gallery.description = description;
    // gallery.publish = publish;
    // gallery.tag = tag;
    // if (updatedImage) {
    //   gallery.image = updatedImage;
    // }
    // await gallery.save();
    res.status(200).send({ success: true, message: "success image created" });
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
    // await Gallery.deleteOne({ _id: id });
    res.status(200).send({ success: true, message: "success deleted" });
  } catch (error) {
    next(error);
  }
};
exports.postImageUpload = async (req, res, next) => {
  const { mimetype, tempFilePath, md5 } = req.files.image;
  if (!tempFilePath || !UPLOADS.includes(mimetype)) {
    res.status(422).send({
      success: false,
      message: "No file attached or wrong image format",
    });
    next();
  }
  // res.send({ data: req.files })
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
          .send({ error, success: false, message: "Error in upload" });
        next(error);
      }

      const image = imageDataFormat(result);
      res.status(200).send({
        success: true,
        message: "file uploaded",
        data: image,
      });
    }
  );
};
