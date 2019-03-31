const cloudinary = require('cloudinary');
const debug = require('debug');
const fs = require('fs');
const cloudinaryConfig = require('../config/cloudinary.config');

cloudinary.v2.config(cloudinaryConfig);

const index = (request, response) => {
  response.render('index', { title: 'WaterMarker' });
};

const watermark = (request, response) => {
  // Accept watermark text from user
  const { imageName, text } = request.params;

  // Set options for image trasformation
  const url = cloudinary.v2.url(`public/${imageName}`, {
    transformation: [
      {
        overlay: {
          font_family: 'Cookie', font_size: 100, font_weight: 'bold', text,
        },
        effect: 'colorize',
        color: 'white',
        opacity: 30,
      },
    ],
  });

  // send response to user
  response.render('watermark', {
    title: 'Watermarker',
    image: url,
    text,
  });
};

const upload = (request, response) => {
  const uploadedImage = request.file;
  const { text } = request.body;

  cloudinary.v2.uploader.upload(uploadedImage.path, { resource_type: 'image', folder: 'public', public_id: uploadedImage.filename }, (error, result) => {
    if (error) {
      response.status(500).json({
        success: false,
        response: {
          message: 'An error occured while uploading image to cloudinary',
          error,
        },
      });
    } else {
      try {
        fs.unlinkSync(uploadedImage.path);
        debug(`Successfully uploaded temp file at '${uploadedImage.path}'`);
      } catch (err) {
        debug(`Error occured deleting temp file uploaded at '${uploadedImage.path}'`);
        debug(`Error: ${err}`);
      }

      response.redirect(`/watermark/${uploadedImage.filename}/${text}`);
    }
  });
};


module.exports = {
  index,
  watermark,
  upload,
};
