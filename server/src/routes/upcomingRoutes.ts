import express from 'express';
import { getUpcomingMovies, createUpcomingMovie, deleteUpcomingMovie, updateUpcomingMovie } from '../controllers/upcomingController';
import { protect, admin } from '../middleware/authMiddleware';
import { upload } from '../utils/multerConfig';

const router = express.Router();

router.get('/', getUpcomingMovies);
router.post('/', protect, admin, upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'trailer', maxCount: 1 }]), createUpcomingMovie);
router.put('/:id', protect, admin, upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'trailer', maxCount: 1 }]), updateUpcomingMovie);
router.delete('/:id', protect, admin, deleteUpcomingMovie);

export default router;
