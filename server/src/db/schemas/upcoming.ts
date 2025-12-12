import { pgTable, serial, text, date, timestamp, boolean } from "drizzle-orm/pg-core";

export const upcomingMovies = pgTable("upcoming_movies", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    genre: text("genre"),
    releaseDate: date("release_date").notNull(),
    posterUrl: text("poster_url"),
    trailerUrl: text("trailer_url"),
    isReleased: boolean("is_released").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
