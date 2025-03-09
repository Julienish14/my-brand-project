// ES6

import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload an image to Cloudinary
export const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    // Create a Cloudinary upload stream
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blog-posts" }, // Optional: Organize images into folders
      (error, result) => {
        if (error) {
          reject(error); // Reject the promise if there's an error
        } else {
          resolve(result.secure_url); // Resolve with the secure URL of the uploaded image
        }
      }
    );
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    bufferStream.pipe(stream);
  });
};
