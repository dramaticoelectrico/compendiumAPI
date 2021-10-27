const Gallery = require("../models/gallery");

exports.getGallery = async (req, res, next) => {
  /**
   * TODO: add query params
   */
  const { curser, limit } = req.query;
  try {
    const gallery = await Gallery.find().sort({ _id: -1 });
    res.status(200).json({ success: true, gallery });
  } catch (error) {
    next(error);
  }
};
