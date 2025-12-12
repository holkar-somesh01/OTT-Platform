import { Request, Response } from 'express';
import { db } from '../db';
import { movies } from '../db/schemas';
import { eq, desc, ilike, or, sql, asc } from 'drizzle-orm';

export const getMovies = async (req: Request, res: Response) => {
    try {
        const { type, page, limit, search, sortBy, sortOrder } = req.query;

        // Base query conditions
        const conditions = [];

        if (type) {
            conditions.push(eq(movies.type, type as string));
        }

        if (search) {
            const searchTerm = `%${String(search).toLowerCase()}%`;
            conditions.push(or(
                ilike(movies.title, searchTerm),
                ilike(movies.description, searchTerm)
            ));
        }

        // --- Execute Query with Filters, Pagination, and Sorting ---
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const offset = (pageNum - 1) * limitNum;

        // Determine sort field and order
        let orderBy;
        const sortDir = sortOrder === 'asc' ? asc : desc;

        switch (sortBy) {
            case 'title': orderBy = sortDir(movies.title); break;
            case 'releaseYear': orderBy = sortDir(movies.releaseYear); break;
            case 'createdAt': orderBy = sortDir(movies.createdAt); break;
            default: orderBy = desc(movies.createdAt);
        }

        // Get total count for pagination metadata
        // Note: Ideally use a separate count query for performance, but for this scale, fetching length is okay or a dedicated count
        // Drizzle way for count with conditions:
        // This is tricky without raw sql or extra steps in some versions, but let's try a cleaner way if possible or just run two queries.

        // Query for data
        let dataQuery = db.select()
            .from(movies)
            .limit(limitNum)
            .offset(offset)
            .orderBy(orderBy);

        // Apply where clauses dynamically
        if (conditions.length > 0) {
            // @ts-ignore - 'and' accepts variadic arguments
            dataQuery = dataQuery.where(conditions.length === 1 ? conditions[0] : sql.join(conditions, sql` AND `));
        }

        // Query for Total Count
        // We need to apply same conditions
        // A simple way is to use a separate query without limit/offset
        let countQuery = db.select({ count: sql`count(*)` }).from(movies);
        if (conditions.length > 0) {
            // @ts-ignore
            countQuery = countQuery.where(conditions.length === 1 ? conditions[0] : sql.join(conditions, sql` AND `));
        }

        const [data, countResult] = await Promise.all([
            dataQuery,
            countQuery
        ]);

        const total = Number(countResult[0]?.count || 0);

        // If pagination params are present, return metadata structure
        if (page || limit || search) {
            res.json({
                data,
                meta: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum)
                }
            });
        } else {
            // Backward compatibility for standard fetch without params (if any)
            // But actually, front-end expects array if no wrapper used.
            // If type is passed but no page, we might just return array or the structure.
            // Existing frontend code expects an ARRAY.
            // We should check if the client can handle the new structure or if we should default to array if no 'page' param.
            // Given the request is to "implement pagination", the client code calling this with pagination params will expect the new structure.
            // Legacy calls (home page dashboard) likely don't pass 'page'.

            if (!page && !limit && !search && !sortBy) {
                // Return all (or default limited) as array to not break Dashboard
                // Recalculate without limit for "all"? Or keep default limit?
                // Original logic for "type" was just return list.
                // Let's re-run a simple query for legacy support
                const legacyResult = await db.select().from(movies)
                    .where(type ? eq(movies.type, type as string) : undefined)
                    .orderBy(desc(movies.createdAt));
                res.json(legacyResult);
            } else {
                // If any pagination param is there, send wrapped response
                res.json({
                    data,
                    meta: {
                        total,
                        page: pageNum,
                        limit: limitNum,
                        totalPages: Math.ceil(total / limitNum)
                    }
                });
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const createMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, genre, releaseYear, type, category } = req.body;
        // Files are handled by multer and available in req.files
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const posterUrl = files?.poster?.[0] ? `/uploads/${files.poster[0].filename}` : null;
        const videoUrl = files?.video?.[0] ? `/uploads/${files.video[0].filename}` : null;

        const [newMovie] = await db.insert(movies).values({
            title,
            description,
            genre,
            releaseYear: parseInt(releaseYear),
            posterUrl,
            videoUrl,
            type: type || 'movie',
            category,
        }).returning();

        res.status(201).json(newMovie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteMovie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.delete(movies).where(eq(movies.id, parseInt(id)));
        res.json({ message: 'Movie deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateMovie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, genre, releaseYear, type, category } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Get existing movie to preserve old files if not replaced
        const [existingMovie] = await db.select().from(movies).where(eq(movies.id, parseInt(id)));

        if (!existingMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const posterUrl = files?.poster?.[0] ? `/uploads/${files.poster[0].filename}` : existingMovie.posterUrl;
        const videoUrl = files?.video?.[0] ? `/uploads/${files.video[0].filename}` : existingMovie.videoUrl;

        const [updatedMovie] = await db.update(movies).set({
            title,
            description,
            genre,
            releaseYear: parseInt(releaseYear),
            type,
            category,
            posterUrl,
            videoUrl,
            updatedAt: new Date(),
        })
            .where(eq(movies.id, parseInt(id)))
            .returning();

        res.json(updatedMovie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
