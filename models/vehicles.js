const pool = require("../config/db")
const crypto = require("crypto");

async function getAllVehicles() {
  const query = `SELECT * FROM "Vehicles" ORDER BY "createdAt" DESC`;
  const result = await pool.query(query);
  return result.rows;
}

async function getCar(vehicleId) {
  const query = `SELECT * FROM "Vehicles" WHERE "vehicleId" = $1`;
  const result = await pool.query(query, [vehicleId]);
  return result.rows[0];
}

async function newCar(brand, model, plate, year, imageUrl, color, 
  category, transmission, fuelType, seats, mileage, dailyPrice, 
  availabilityStatus, maintenanceStatus) {
  const vehicleId = crypto.randomUUID();

  const sql = `
    INSERT INTO "Vehicles" ("vehicleId", "brand", "model", "plate", 
    "year", "imageUrl", "color", "category", "transmission", "fuelType", 
    "seats", "mileage", "dailyPrice", "availabilityStatus", 
    "maintenanceStatus", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 
      $10, $11, $12, $13, $14, $15, NOW(), NOW())
    RETURNING *`;

  const result = await pool.query(sql, [vehicleId, brand, model, 
    plate, year, imageUrl, color, category, transmission, fuelType, 
    seats, mileage, dailyPrice, availabilityStatus, maintenanceStatus]);

  return result.rows[0];
}

async function updateCar(vehicleId, brand, model, plate, year,
  imageUrl, color, category, transmission, fuelType, seats,
  mileage, dailyPrice, availabilityStatus,maintenanceStatus
) {
  const sql = `
    UPDATE "Vehicles"
    SET
      "brand" = $1, "model" = $2, "plate" = $3, "year" = $4, 
      "imageUrl" = $5, "color" = $6, "category" = $7, "transmission" = $8,
      "fuelType" = $9, "seats" = $10, "mileage" = $11,"dailyPrice" = $12,
      "availabilityStatus" = $13, "maintenanceStatus" = $14, "updatedAt" = NOW()
    WHERE "vehicleId" = $15
    RETURNING *;
  `;

  const result = await pool.query(sql, [
    brand, model, plate, year, imageUrl, color, category,
    transmission, fuelType, seats, mileage, dailyPrice,
    availabilityStatus, maintenanceStatus, vehicleId
  ]);

  return result.rows[0];
}

async function deleteCar(vehicleId) {
  const sql = `DELETE FROM "Vehicles" WHERE "vehicleId" = $1 RETURNING *;`;
  
  const result = await pool.query(sql, [vehicleId]);

  return result.rows[0]
}


module.exports = {getAllVehicles, getCar, newCar, updateCar, deleteCar}