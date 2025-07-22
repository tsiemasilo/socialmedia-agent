import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const databaseUrl = "postgresql://neondb_owner:npg_3ZrLMJhXf7bv@ep-mute-lake-aewl9d1o-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function checkTables() {
  const pool = new Pool({ connectionString: databaseUrl });
  
  try {
    console.log('Checking database tables...');
    
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('Tables found:', result.rows.map(row => row.table_name));
    
    if (result.rows.length === 0) {
      console.log('No tables found. Database schema needs to be created.');
    }
    
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await pool.end();
  }
}

checkTables();