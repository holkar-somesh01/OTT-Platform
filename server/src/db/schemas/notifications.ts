import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const notifications = pgTable("notifications", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: text("type", { enum: ["info", "warning", "success", "error"] }).default("info"),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});
