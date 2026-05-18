// db.js
const { Pool } = require('pg');
require('dotenv').config(); // Loads the variables from your .env file

// Create a new pool instance using our environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the connection instantly when the app starts
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error acquiring client from pool:', err.stack);
  }
  console.log('✅ Successfully connected to PostgreSQL database!');
  release(); 
});

// Export the query method so we can use it in our controllers
module.exports = {
  query: (text, params) => pool.query(text, params),
};