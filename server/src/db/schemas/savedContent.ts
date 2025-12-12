import { pgTable, serial, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./users";
import { movies } from "./movies";

export const savedContent = pgTable("saved_content", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    movieId: integer("movie_id").references(() => movies.id, { onDelete: 'cascade' }).notNull(),
    savedAt: timestamp("saved_at").defaultNow(),
}, (t) => ({
    unq: unique().on(t.userId, t.movieId),
}));
