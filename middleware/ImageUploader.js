import multer from "multer";
import path from "path";

const storage = (destination) =>
  multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, destination);
    },
    filename: (_, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

const ImageUploader = (destination) =>
  multer({
    storage: storage(destination),
  });

export default ImageUploader;
