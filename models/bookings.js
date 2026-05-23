const pool = require("../config/db")

async function getAllBookings() {
  const query = `SELECT * FROM "Bookings" ORDER BY "createdAt" DESC`;
  const result = await pool.query(query);
  return result.rows;
}