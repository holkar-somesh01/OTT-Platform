import { Request, Response } from 'express';
import { db } from '../db';
import { notifications } from '../db/schemas';
import { eq, desc } from 'drizzle-orm';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        /*
        const userNotifications = await db
            .select()
            .from(notifications)
            .where(eq(notifications.userId, userId))
            .orderBy(desc(notifications.createdAt));
        
        res.json(userNotifications);
        */
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    res.json({ message: 'Notification marked as read' });
};


// For demo purposes, we might want to manually adding notifications
export const createNotification = async (req: Request, res: Response) => {
    res.status(201).json({ message: 'Notification created' });
}
