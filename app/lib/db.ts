"use server";

import { createPool, type Pool, type PoolOptions } from "mysql2/promise";

let pool: Pool | null = null;

const requiredEnvVars = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
] as const;

function assertEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing database environment variables: ${missing.join(
        ", "
      )}. Please define them in your .env.local file.`
    );
  }
}

export async function getDbPool(): Promise<Pool> {
  if (pool) {
    return pool;
  }

  assertEnv();

  const config: PoolOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    connectionLimit: 10,
  };

  pool = createPool(config);
  return pool;
}
