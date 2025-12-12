import { Request, Response } from 'express';
import { db } from '../db';
import { users, movies } from '../db/schemas';
import { sql } from 'drizzle-orm';

export const getAnalytics = async (_req: Request, res: Response) => {
    try {
        const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
        const [movieCount] = await db.select({ count: sql<number>`count(*)` }).from(movies);

        // Get actual genre distribution
        const genreCounts = await db
            .select({
                name: movies.genre,
                value: sql<number>`count(*)::int`,
            })
            .from(movies)
            .groupBy(movies.genre);

        // Mock data for graphs since we don't have real activity tracking yet
        const activityData = [
            { name: 'Mon', active: userCount.count * 0.8, new: 2 },
            { name: 'Tue', active: userCount.count * 0.9, new: 5 },
            { name: 'Wed', active: userCount.count * 0.85, new: 3 },
            { name: 'Thu', active: userCount.count * 0.92, new: 1 },
            { name: 'Fri', active: userCount.count * 0.95, new: 4 },
            { name: 'Sat', active: userCount.count * 0.88, new: 2 },
            { name: 'Sun', active: userCount.count * 0.9, new: 6 },
        ];

        res.json({
            totalUsers: userCount.count,
            totalMovies: movieCount.count,
            activeStreams: Math.floor(userCount.count * 0.4), // Pseudo-real
            revenue: userCount.count * 15, // Pseudo-real based on users
            activityData,
            genreData: genreCounts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
