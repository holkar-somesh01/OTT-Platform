import { Request, Response } from 'express';
import { db } from '../db';
import { upcomingMovies } from '../db/schemas';
import { eq, desc } from 'drizzle-orm';

export const getUpcomingMovies = async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(upcomingMovies).orderBy(desc(upcomingMovies.releaseDate));
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createUpcomingMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, genre, releaseDate, isReleased } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const posterUrl = files?.poster?.[0] ? `/uploads/${files.poster[0].filename}` : null;
        // Upcoming movies might usually have a trailer link (youtube) or an uploaded trailer. 
        // For consistency with movie controller, let's assume it can be uploaded or just a link.
        // If uploaded:
        const trailerUrl = files?.trailer?.[0] ? `/uploads/${files.trailer[0].filename}` : req.body.trailerUrl;

        const [newMovie] = await db.insert(upcomingMovies).values({
            title,
            description,
            genre,
            releaseDate,
            posterUrl,
            trailerUrl,
            isReleased: isReleased === 'true' || isReleased === true,
        }).returning();

        res.status(201).json(newMovie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteUpcomingMovie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.delete(upcomingMovies).where(eq(upcomingMovies.id, parseInt(id)));
        res.json({ message: 'Upcoming movie deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUpcomingMovie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, genre, releaseDate, isReleased } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const [existingMovie] = await db.select().from(upcomingMovies).where(eq(upcomingMovies.id, parseInt(id)));

        if (!existingMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const posterUrl = files?.poster?.[0] ? `/uploads/${files.poster[0].filename}` : existingMovie.posterUrl;
        const trailerUrl = files?.trailer?.[0] ? `/uploads/${files.trailer[0].filename}` : existingMovie.trailerUrl;

        const [updatedMovie] = await db.update(upcomingMovies).set({
            title,
            description,
            genre,
            releaseDate,
            posterUrl,
            trailerUrl,
            isReleased: isReleased === 'true' || isReleased === true,
            updatedAt: new Date(),
        })
            .where(eq(upcomingMovies.id, parseInt(id)))
            .returning();

        res.json(updatedMovie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
