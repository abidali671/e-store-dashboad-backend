import multer from "multer";

const storage = multer.memoryStorage();
const FileUploader = multer({ storage });

export default FileUploader;
