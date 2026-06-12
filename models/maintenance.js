const pool = require("../config/db")
const crypto = require("crypto");

async function getAllMaintenances(limit = 10, offset = 0) {
  const sql = `
    SELECT m.*, v."brand", v."model", v."plate", u."userName" AS "createdByName"
    FROM "Maintenance" m
    LEFT JOIN "Vehicles" v ON m."vehicleId" = v."vehicleId"
    LEFT JOIN "Users" u ON m."createdBy" = u."userId"
    ORDER BY m."createdAt" DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await pool.query(sql, [limit, offset]);
  return result.rows;
}

async function countAllMaintenance() {
  const sql = `
    SELECT COUNT(*) AS count
    FROM "Maintenance";
  `;

  const result = await pool.query(sql);
  return parseInt(result.rows[0].count);
}

async function getMaintenance(maintenanceId) {
  const sql = `SELECT * FROM "Maintenance" WHERE "maintenanceId" = $1`;
  const result = await pool.query(sql, [maintenanceId]);
  return result.rows[0];
}

async function newMaintenance(vehicleId, createdBy, maintenanceType, 
  description, maintenanceDate, cost, status
) {
  const maintenanceId = crypto.randomUUID();

  const sql = `
    INSERT INTO "Maintenance" ("maintenanceId", "vehicleId", "createdBy", "maintenanceType", 
    "description", "maintenanceDate", "cost", "status", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    RETURNING *;
    `;

  const result = await pool.query(sql, [maintenanceId, vehicleId, createdBy, 
    maintenanceType, description, maintenanceDate, cost, status]);

  return result.rows[0];
}

async function updateMaintenance(maintenanceId, vehicleId, maintenanceType, 
  description, maintenanceDate, cost, status
) {
  const sql = `
    UPDATE "Maintenance"
    SET
      "vehicleId" = $1, "maintenanceType" = $2, "description" = $3, 
      "maintenanceDate" = $4, "cost" = $5, "status" = $6, 
      "updatedAt" = NOW()
    WHERE "maintenanceId" = $7
    RETURNING *;
  `;

  const result = await pool.query(sql, [
    vehicleId, maintenanceType, description, 
    maintenanceDate, cost, status, maintenanceId
  ]);

  return result.rows[0];
}

async function deleteMaintenance(maintenanceId) {
  const sql = `DELETE FROM "Maintenance" WHERE "maintenanceId" = $1 RETURNING *;`;
  
  const result = await pool.query(sql, [maintenanceId]);

  return result.rows[0];
}

module.exports = { getAllMaintenances, countAllMaintenance, getMaintenance , newMaintenance, updateMaintenance, deleteMaintenance}