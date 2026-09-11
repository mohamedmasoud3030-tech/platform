import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

/**
 * PostgreSQL is required for admin, inquiries and auth — not for the public
 * assistant, which answers from the verified help corpus. The previous eager
 * throw on import crashed the whole Vercel function whenever DATABASE_URL was
 * unset, so every tRPC call (including assistant.ask) returned 500.
 *
 * The pool is created on first use. Importing this module is therefore safe
 * in a database-less deployment; touching `db` / `pool` without DATABASE_URL
 * still throws the same error as before.
 */

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  return url;
}

function createPool(): pg.Pool {
  return new Pool({ connectionString: requireDatabaseUrl() });
}

function createDb(pool: pg.Pool) {
  return drizzle(pool, { schema });
}

type AppDb = ReturnType<typeof createDb>;

let poolInstance: pg.Pool | undefined;
let dbInstance: AppDb | undefined;

function resolvePool(): pg.Pool {
  if (!poolInstance) poolInstance = createPool();
  return poolInstance;
}

function resolveDb(): AppDb {
  if (!dbInstance) dbInstance = createDb(resolvePool());
  return dbInstance;
}

function lazy<T extends object>(resolve: () => T): T {
  return new Proxy({} as T, {
    get(_target, property) {
      const real = resolve();
      const value = Reflect.get(real, property, real);
      return typeof value === "function" ? value.bind(real) : value;
    },
    set(_target, property, next) {
      return Reflect.set(resolve(), property, next);
    },
    has(_target, property) {
      return Reflect.has(resolve(), property);
    },
  });
}

export const pool: pg.Pool = lazy(resolvePool);
export const db: AppDb = lazy(resolveDb);

export * from "./schema";
