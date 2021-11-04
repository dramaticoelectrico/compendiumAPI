const Gallery = require("../models/gallery");

exports.getGallery = async (req, res, next) => {
  /**
   * TODO: add query params
   */
  const { curser, limit } = req.query;
  const { id } = req.params;
  let gallery;

  try {
    if (id) {
      gallery = await Gallery.find({ _id: id });
    } else {
      gallery = await Gallery.find().sort({ _id: -1 });
    }
    res.status(200).json({ success: true, gallery });
  } catch (error) {
    next(error);
  }
};
