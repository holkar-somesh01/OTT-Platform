
import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const storage = multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb) => {
        cb(null, 'uploads/');
    },
    filename: (_req: Request, file: Express.Multer.File, cb) => {
        // Generates a unique filename using current timestamp and a random number to simulate microseconds uniqueness
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const checkFileType = (file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|webm|mkv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Images and Videos only!'));
    }
};

export const upload = multer({
    storage,
    fileFilter: (_req: Request, file: Express.Multer.File, cb) => {
        checkFileType(file, cb);
    },
});
