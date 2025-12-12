
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { users } from '../db/schemas';
import { eq } from 'drizzle-orm';
import { generateToken } from '../utils/tokenUtils';
import { sendEmail } from '../utils/emailConfig';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        }).returning();

        if (newUser) {
            res.status(201).json({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                token: generateToken(newUser.id, newUser.role || 'user'),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role || 'user'),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await db.update(users).set({ otp, otpExpiry }).where(eq(users.id, user.id));

        const emailSent = await sendEmail(
            email,
            'Password Reset OTP',
            `Your OTP for password reset is: ${otp}`
        );

        if (emailSent) {
            res.json({ message: 'OTP sent to email' });
        } else {
            // Fallback for demo showing OTP if email fails (NOT SECURE for prod!)
            res.json({ message: 'OTP generated (Email failed)', debug_otp: otp });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;
        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user || user.otp !== otp || (user.otpExpiry && new Date() > user.otpExpiry)) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        res.json({ message: 'OTP verified', email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.update(users).set({
            password: hashedPassword,
            otp: null,
            otpExpiry: null,
        }).where(eq(users.id, user.id));

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const [user] = await db.select().from(users).where(eq(users.id, userId));

        if (user) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { name } = req.body;

        const [user] = await db.select().from(users).where(eq(users.id, userId));

        if (user) {
            await db.update(users).set({ name }).where(eq(users.id, userId));

            const [updatedUser] = await db.select().from(users).where(eq(users.id, userId));

            res.json({
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser.id, updatedUser.role || 'user'),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { currentPassword, newPassword } = req.body;

        const [user] = await db.select().from(users).where(eq(users.id, userId));

        if (user && (await bcrypt.compare(currentPassword, user.password))) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
