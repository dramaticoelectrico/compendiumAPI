require('dotenv').config()
const express = require('express')
const app = express()
const fileUpload = require('express-fileupload')

const UPLOADS = [
  'image/jpeg',
  'image/gif',
  'image/WebP',
  'image/SVG',
  'image/WDP',
]

app.use(
  fileUpload({
    useTempFiles: true,
  })
)

const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

app.post('/api/upload', (req, res, next) => {
  const { mimetype, tempFilePath, md5 } = req.files.image
  if (!tempFilePath || !UPLOADS.includes(mimetype)) {
    return res.status(422).send({
      success: false,
      message: 'No file attached or wrong image format',
    })
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
          max_images: 6,
        },
      ],
      public_id: md5,
    },
    function (error, result) {
      if (error) {
        return res
          .status(500)
          .send({ error, success: false, message: 'Error in upload' })
      }
      res.status(200).send({
        success: true,
        message: 'file uploaded',
        data: result,
      })
    }
  )
})

const port = process.env.PORT || 9000
app.listen(port, () => console.log(`Listening on ${port}`))
