import multer from "multer";
import fs from "fs";
import path from "path";

// Upload folder
const uploadDir = path.join(
    process.cwd(),
    "uploads",
    "products"
);

// Folder nahi hai to automatically create karo
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadDir);

    },

    filename: (req, file, cb) => {

        const fileName =
            Date.now() + "-" + file.originalname;

        cb(null, fileName);

    }

});

const upload = multer({
    storage: storage
});

export default upload;