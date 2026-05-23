const pool = require("../config/db")

async function getUserById(userId) {
  const query = `SELECT * FROM "User" WHERE "userId" = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

async function getAllUsers() {
  const query = `SELECT * FROM "User" ORDER BY "createdAt" DESC`
  const result = await pool.query(query)
  return result.rows
}

module.exports = {getAllUsers, getUserById}