import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DB = NeonHttpDatabase<typeof schema>;

let _db: DB | null = null;

function getDb(): DB {
  if (_db) return _db;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL n'est pas défini. Provisionnez Neon Postgres et ajoutez-le dans .env.local",
    );
  }

  const sql = neon(databaseUrl);
  _db = drizzle({ client: sql, schema });
  return _db;
}

// Proxy : initialise la connexion à la première requête seulement (pas au build).
export const db = new Proxy({} as DB, {
  get(_target, prop) {
    const instance = getDb();
    const value = instance[prop as keyof DB];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
