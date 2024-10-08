const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.uploadDocument = async (req, res) => {
    // console.log("req recieved",req);
  try {
    const file = req.file;

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'document_sharing', // Folder in Cloudinary
      resource_type: 'auto', // Accept any file type
    });

    // Remove the file from the local uploads folder
    fs.unlinkSync(file.path);

    // Return the Cloudinary URL to the client
    const url = result.secure_url;
    res.status(200).json({ url:url });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).send({ message: 'File upload failed', error });
  }
};
