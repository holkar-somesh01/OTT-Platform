import express from 'express';
import { getNotifications, markAsRead, createNotification } from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

console.log('protect:', protect);
console.log('getNotifications:', getNotifications);
console.log('markAsRead:', markAsRead);
console.log('createNotification:', createNotification);


router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.post('/', protect, createNotification); // In a real app, this might be internal or admin only

export default router;
