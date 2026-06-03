const pool = require("../config/db")

async function getClientById(clientId) {
  const query = `SELECT * FROM "Clients" WHERE "clientId" = $1`;
  const result = await pool.query(query, [clientId]);
  return result.rows[0];
}

async function getAllClients() {
  const query = `SELECT * FROM "Clients" ORDER BY "createdAt" DESC`
  const result = await pool.query(query)
  return result.rows
}

async function getClientByEmail(clientEmail) {
  const query = `SELECT * FROM "Clients" WHERE "clientEmail" = $1`;
  const result = await pool.query(query, [clientEmail]);
  return result.rows[0];
}

async function createClient(clientName, clientEmail, clientPassword, clientAddress, clientPhone, driverLicenseNumber) {
  const query = `
    INSERT INTO "Clients" ("clientName", "clientEmail", "clientPassword", "clientAddress", "clientPhone", "driverLicenseNumber", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *
  `;
  const result = await pool.query(query, [clientName, clientEmail, clientPassword, clientAddress, clientPhone, driverLicenseNumber]);
  return result.rows[0];
}

module.exports = {getAllClients, getClientById, getClientByEmail, createClient}