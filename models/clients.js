const pool = require("../config/db")

async function getClientById(clientId) {
  const query = `SELECT * FROM "Client" WHERE "clientId" = $1`;
  const result = await pool.query(query, [clientId]);
  return result.rows[0];
}

async function getAllClients() {
  const query = `SELECT * FROM "Client" ORDER BY "createdAt" DESC`
  const result = await pool.query(query)
  return result.rows
}

module.exports = {getAllClients, getClientById}