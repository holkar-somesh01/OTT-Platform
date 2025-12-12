
import express from 'express';
import {
    register,
    login,
    forgotPassword,
    verifyOtp,
    resetPassword,
    getProfile,
    updateProfile,
    updatePassword
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);

export default router;
