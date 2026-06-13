const pool = require("../config/db")
const crypto = require("crypto");

async function getAllVehicles(filters = {}, limit = 9, offset = 0) {
  const { whereSql, params } = buildVehiclesFilters(filters);

  params.push(limit);
  const limitIndex = params.length;

  params.push(offset);
  const offsetIndex = params.length;

  const sql = `
    SELECT
      v."vehicleId", v."brand", v."model", v."plate", v."year",
      v."imageUrl", v."color", v."category", v."transmission",
      v."fuelType", v."seats", v."mileage", v."dailyPrice",
      v."availabilityStatus", v."maintenanceStatus",
      v."createdAt", v."updatedAt"
    FROM "Vehicles" v ${whereSql}
    ORDER BY v."createdAt" DESC
    LIMIT $${limitIndex} OFFSET $${offsetIndex}
  `;

  const result = await pool.query(sql, params);
  return result.rows;
}

async function getCar(vehicleId) {
  const query = `SELECT * FROM "Vehicles" WHERE "vehicleId" = $1`;
  const result = await pool.query(query, [vehicleId]);
  return result.rows[0];
}

async function admGetAllVehicles(limit = 10, offset = 0) {
  const sql = `SELECT * 
    FROM "Vehicles" ORDER BY "createdAt" DESC 
    LIMIT $1 OFFSET $2`;
  const result = await pool.query(sql, [limit, offset]);
  return result.rows;
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

async function countAllVehicles() {
  const sql = `
    SELECT COUNT(*) AS count
    FROM "Vehicles";
  `;

  const result = await pool.query(sql);
  return parseInt(result.rows[0].count);
}

async function countVehicleCatalog(filters = {}) {
  const { whereSql, params } = buildVehiclesFilters(filters);

  const sql = `
    SELECT COUNT(*) AS count
    FROM "Vehicles" v
    ${whereSql};
  `;

  const result = await pool.query(sql, params);
  return parseInt(result.rows[0].count);
}

function buildVehiclesFilters(filters) {
  const conditions = [];
  const params = [];

  if (filters.search) {
    params.push(`%${filters.search}%`);
    const index = params.length;

    conditions.push(`
      (
        v."brand" ILIKE $${index} OR v."model" ILIKE $${index} OR v."category" ILIKE $${index} OR 
        v."color" ILIKE $${index} OR v."fuelType" ILIKE $${index} OR v."plate" ILIKE $${index}
      )
    `);
  }

  if (filters.category) {
    params.push(filters.category);
    conditions.push(`LOWER(v."category") = LOWER($${params.length})`);
  }

  if (filters.transmission) {
    params.push(filters.transmission);
    conditions.push(`LOWER(v."transmission") = LOWER($${params.length})`);
  }

  if (filters.availabilityStatus) {
    params.push(filters.availabilityStatus);
    conditions.push(`LOWER(v."availabilityStatus") = LOWER($${params.length})`);
  }

  const whereSql = conditions.length > 0
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  return { whereSql, params };
}


module.exports = {getAllVehicles, getCar, admGetAllVehicles, countAllVehicles, newCar, 
  updateCar, deleteCar, countVehicleCatalog, buildVehiclesFilters}