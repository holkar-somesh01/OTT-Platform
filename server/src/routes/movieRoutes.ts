import express from 'express';
import { getMovies, createMovie, deleteMovie, updateMovie } from '../controllers/movieController';
import { protect, admin } from '../middleware/authMiddleware';
import { upload } from '../utils/multerConfig';

const router = express.Router();

router.get('/', getMovies);
router.post('/', protect, admin, upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'video', maxCount: 1 }]), createMovie);
router.put('/:id', protect, admin, upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'video', maxCount: 1 }]), updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

export default router;
