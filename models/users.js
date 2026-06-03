const pool = require("../config/db")
const crypto = require("crypto");

async function getUserById(userId) {
  const query = `SELECT * FROM "Users" WHERE "userId" = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

async function getUserByEmail(userEmail) {
  const query = `SELECT * FROM "Users" WHERE "userEmail" = $1`;
  const result = await pool.query(query, [userEmail]);
  return result.rows[0];
}

async function getAllUsers() {
  const query = `SELECT * FROM "Users" ORDER BY "createdAt" DESC`
  const result = await pool.query(query)
  return result.rows
}

async function updateUser(userId, userName, userEmail, userPassword,userRole) {
  const sql = `
    UPDATE "Users"
    SET
      "userName" = $1, "userEmail" = $2, "userPassword" = $3, 
      "userRole" = $4,"updatedAt" = NOW()
    WHERE "userId" = $5
    RETURNING *`

  const result = await pool.query(sql, [
    userName, userEmail, userPassword, userRole, userId
  ])

  return result.rows[0]
}

async function createNewUser(userName, userEmail, userPassword, userRole) {
  const userId = crypto.randomUUID();
  
  const sql = `
    INSERT INTO "Users" ("userId", "userName", "userEmail", "userPassword", "userRole", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING *`;
  
  const result = await pool.query(sql, [userId, userName, userEmail, userPassword, userRole]);
  
  return result.rows[0];
}

async function deleteUser(userId) {
  const sql = `DELETE FROM "Users" WHERE "userId" = $1 RETURNING *`;

  const result = await pool.query(sql, [userId]);
  return result.rows[0];
}

async function createUser(userName, userEmail, hashedPassword) {
  const userId = crypto.randomUUID();
  const query = `
    INSERT INTO "Users" ("userId", "userName", "userEmail", "userPassword", "userRole", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, 'client', NOW(), NOW())
    RETURNING *
  `;
  const result = await pool.query(query, [userId, userName, userEmail, hashedPassword]);
  return result.rows[0];
}

module.exports = { getAllUsers, getUserById, getUserByEmail, createUser, createNewUser, updateUser, deleteUser }