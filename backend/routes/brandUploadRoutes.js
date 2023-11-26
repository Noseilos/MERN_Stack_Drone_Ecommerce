import path from 'path'
import express from 'express'
import multer from 'multer'

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads/brands/'); // Null is for error
    },
    filename(req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
});

function checkFileType(file, cb){
    const fileTypes = /jpg|jpeg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase);
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
});

router.post('/', upload.single('image'), (req, res) => {
    res.send({
        message: 'Image uploaded',
        image: `/${req.file.path}`
    });
})

export default router;