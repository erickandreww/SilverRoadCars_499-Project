const pool = require("../config/db")

async function getUserById(userId) {
  const query = `SELECT * FROM "User" WHERE "userId" = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

async function getUserByEmail(userEmail) {
  const query = `SELECT * FROM "User" WHERE "userEmail" = $1`;
  const result = await pool.query(query, [userEmail]);
  return result.rows[0];
}

async function getAllUsers() {
  const query = `SELECT * FROM "User" ORDER BY "createdAt" DESC`
  const result = await pool.query(query)
  return result.rows
}

async function createUser(userName, userEmail, hashedPassword) {
  const userId = crypto.randomUUID();
  const query = `
    INSERT INTO "User" ("userId", "userName", "userEmail", "userPassword", "userRole", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, 'client', NOW(), NOW())
    RETURNING *
  `;
  const result = await pool.query(query, [userId, userName, userEmail, hashedPassword]);
  return result.rows[0];
}

module.exports = { getAllUsers, getUserById, getUserByEmail, createUser }