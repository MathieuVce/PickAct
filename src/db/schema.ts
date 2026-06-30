import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/** Modes de transport, permet notamment de savoir si une voiture est nécessaire. */
export const travelModeEnum = pgEnum("travel_mode", [
  "walk",
  "bike",
  "car",
  "transit",
]);

/** Statut d'une activité dans le cycle de tirage. */
export const activityStatusEnum = pgEnum("activity_status", [
  "active",
  "validated",
  "skipped",
  "later",
]);

export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  inviteCode: text("invite_code").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const members = pgTable(
  "members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    /** Hash scrypt du mot de passe (format scrypt$salt$hash). */
    passwordHash: text("password_hash").notNull(),
    /** Identifie le membre sur un navigateur (cookie httpOnly), régénéré à chaque connexion. */
    sessionToken: text("session_token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // Un pseudo unique par groupe (insensible à la casse) pour une connexion déterministe.
    uniqueIndex("members_group_pseudo_unique").on(
      table.groupId,
      sql`lower(${table.displayName})`,
    ),
  ],
);

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Auteur, JAMAIS exposé aux autres membres. Visible uniquement dans la zone admin. */
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  link: text("link"),
  estMinutes: integer("est_minutes").notNull(),
  travelMinutes: integer("travel_minutes"),
  travelMode: travelModeEnum("travel_mode"),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  notes: text("notes"),
  status: activityStatusEnum("status").notNull().default("active"),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Group = typeof groups.$inferSelect;
export type Member = typeof members.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type TravelMode = (typeof travelModeEnum.enumValues)[number];
export type ActivityStatus = (typeof activityStatusEnum.enumValues)[number];
