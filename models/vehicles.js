const pool = require("../config/db")

async function getAllVehicles() {
  const query = `SELECT * FROM "Vehicles" ORDER BY "createdAt" DESC`;
  const result = await pool.query(query);
  return result.rows;
}