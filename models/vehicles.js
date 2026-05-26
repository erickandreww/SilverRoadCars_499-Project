const pool = require("../config/db")

async function getAllVehicles() {
  const query = `SELECT * FROM "Vehicles" ORDER BY "createdAt" DESC`;
  const result = await pool.query(query);
  return result.rows;
}

async function getCar(carId) {
  const query = `SELECT * FROM "Vehicles" WHERE "vehicleId" = $1`;
  const result = await pool.query(query, [carId]);
  return result.rows[0];
}

module.exports = {getAllVehicles, getCar}