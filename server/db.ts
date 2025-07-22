import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use Netlify database URL or fallback to local, but prioritize Netlify for consistency
const databaseUrl = "postgresql://neondb_owner:npg_3ZrLMJhXf7bv@ep-mute-lake-aewl9d1o-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL or NETLIFY_DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });