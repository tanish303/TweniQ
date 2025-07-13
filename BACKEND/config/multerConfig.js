const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary"); // adjust path if needed

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tweniq/dps", // Images go in this folder inside Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 300, height: 300, crop: "limit" }],
  },
});

const upload = multer({ storage });

module.exports = upload;
