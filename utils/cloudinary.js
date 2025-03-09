// // Import the Cloudinary v2 SDK
// var cloudinary = require("cloudinary").v2;
// var Readable = require("stream").Readable;

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Function to upload an image to Cloudinary
// function uploadImage(file) {
//   return new Promise(function (resolve, reject) {
//     // Create a Cloudinary upload stream
//     var stream = cloudinary.uploader.upload_stream(
//       { folder: "blog-posts" }, // Optional: Organize images into folders
//       function (error, result) {
//         if (error) {
//           reject(error); // Reject the promise if there's an error
//         } else {
//           resolve(result.secure_url); // Resolve with the secure URL of the uploaded image
//         }
//       }
//     );

//     // Convert the file buffer to a readable stream
//     var bufferStream = new Readable();
//     bufferStream.push(file.buffer); // Push the file buffer into the stream
//     bufferStream.push(null); // Signal the end of the stream

//     // Pipe the buffer stream to the Cloudinary upload stream
//     bufferStream.pipe(stream);
//   });
// }

// // Export the uploadImage function
// module.exports = {
//   uploadImage: uploadImage,
// };

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

    // Convert the file buffer to a readable stream
    const bufferStream = new Readable();
    bufferStream.push(file.buffer); // Push the file buffer into the stream
    bufferStream.push(null); // Signal the end of the stream

    // Pipe the buffer stream to the Cloudinary upload stream
    bufferStream.pipe(stream);
  });
};
