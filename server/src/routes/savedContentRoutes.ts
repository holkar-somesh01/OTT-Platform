import express from 'express';
import { toggleSaveContent, getSavedContent } from '../controllers/savedContentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/toggle', protect, toggleSaveContent);
router.get('/', protect, getSavedContent);

export default router;
