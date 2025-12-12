import { Request, Response } from 'express';
import { db } from '../db';
import { savedContent, movies } from '../db/schemas';
import { eq, and } from 'drizzle-orm';

interface AuthRequest extends Request {
    user?: any;
}

export const toggleSaveContent = async (req: AuthRequest, res: Response) => {
    try {
        const { movieId } = req.body;
        const userId = req.user.id;

        const existing = await db.select().from(savedContent)
            .where(and(eq(savedContent.userId, userId), eq(savedContent.movieId, movieId)));

        if (existing.length > 0) {
            await db.delete(savedContent)
                .where(and(eq(savedContent.userId, userId), eq(savedContent.movieId, movieId)));
            res.json({ message: 'Removed from list', saved: false });
        } else {
            await db.insert(savedContent).values({
                userId,
                movieId
            });
            res.json({ message: 'Added to list', saved: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getSavedContent = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const result = await db.select({
            id: movies.id,
            title: movies.title,
            posterUrl: movies.posterUrl,
            videoUrl: movies.videoUrl,
            type: movies.type,
            savedAt: savedContent.savedAt
        })
            .from(savedContent)
            .innerJoin(movies, eq(savedContent.movieId, movies.id))
            .where(eq(savedContent.userId, userId));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
