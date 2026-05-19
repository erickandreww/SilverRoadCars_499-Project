// db.js
const { Pool } = require('pg');
require('dotenv').config();

let pool;

// If Render provides a single DATABASE_URL (Production), use it
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Internal Render connections don't strictly require SSL, 
    // but keeping this ensures it handles cloud routing gracefully.
    ssl: { rejectUnauthorized: false }
  });
} else {
  // Fallback to individual variables for your local machine (.env)
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') 
      ? { rejectUnauthorized: false } 
      : false,
  });
}

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error acquiring client from pool:', err.stack);
  }
  console.log('✅ Successfully connected to PostgreSQL database!');
  release(); 
});

module.exports = pool;