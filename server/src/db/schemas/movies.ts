import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const movies = pgTable("movies", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    genre: text("genre").notNull(),
    releaseYear: integer("release_year"),
    posterUrl: text("poster_url"),
    videoUrl: text("video_url"),
    type: text("type").default("movie"), // movie, series, short
    category: text("category"), // Trending, Top Rated, etc.
    duration: integer("duration"), // in minutes
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
