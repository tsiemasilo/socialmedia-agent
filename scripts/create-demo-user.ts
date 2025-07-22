import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";
import { users } from "../shared/schema";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Database URL must be set");
}

async function createDemoUser() {
  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle({ client: pool, schema });
  
  try {
    // Create demo user with ID 1
    const user = await db.insert(users).values({
      username: 'demo_user',
      email: 'demo@example.com', 
      password: 'demo_password',
      niche: 'Loadshedding Solutions',
      postingFrequency: 'daily'
    }).onConflictDoNothing().returning();

    console.log('Demo user created:', user[0] || 'User already exists');
    
  } catch (error) {
    console.error('Error creating demo user:', error);
  } finally {
    await pool.end();
  }
}

createDemoUser();