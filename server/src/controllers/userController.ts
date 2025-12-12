import { Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schemas';
import { eq, not, ilike, or, asc, desc, sql } from 'drizzle-orm';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query;

        // Base query conditions
        const conditions = [not(eq(users.role, 'admin'))];

        if (search) {
            const searchTerm = `%${String(search).toLowerCase()}%`;
            conditions.push(or(
                ilike(users.name, searchTerm),
                ilike(users.email, searchTerm)
            ));
        }

        // Pagination Params
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const offset = (pageNum - 1) * limitNum;

        // Sorting
        let orderBy;
        const sortDir = sortOrder === 'asc' ? asc : desc;

        switch (sortBy) {
            case 'name': orderBy = sortDir(users.name); break;
            case 'email': orderBy = sortDir(users.email); break;
            case 'createdAt': orderBy = sortDir(users.createdAt); break;
            default: orderBy = desc(users.createdAt);
        }

        // Fetch Data
        let dataQuery = db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
        })
            .from(users)
            .limit(limitNum)
            .offset(offset)
            .orderBy(orderBy);

        if (conditions.length > 0) {
            // @ts-ignore
            dataQuery = dataQuery.where(conditions.length === 1 ? conditions[0] : sql.join(conditions, sql` AND `));
        }

        // Fetch Count
        let countQuery = db.select({ count: sql`count(*)` }).from(users);
        if (conditions.length > 0) {
            // @ts-ignore
            countQuery = countQuery.where(conditions.length === 1 ? conditions[0] : sql.join(conditions, sql` AND `));
        }

        const [data, countResult] = await Promise.all([
            dataQuery,
            countQuery
        ]);

        const total = Number(countResult[0]?.count || 0);

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
            // Check if client expects array or object.
            // If explicit params not provided but we want consistent API, we might return array for compatibility if needed.
            if (!page && !limit && !search) {
                // For backward compat, return array (limited to default or all?) 
                // Previous implementation returned ALL.
                const allUsers = await db.select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    role: users.role,
                    createdAt: users.createdAt,
                }).from(users).where(not(eq(users.role, 'admin'))).orderBy(desc(users.createdAt));
                res.json(allUsers);
            } else {
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

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.delete(users).where(eq(users.id, parseInt(id)));
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
