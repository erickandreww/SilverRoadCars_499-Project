const pool = require('../config/db');

async function createReview(bookingId, clientId, vehicleId, rating, comment) {
  const reviewId = crypto.randomUUID();
  const query = `
    INSERT INTO "Reviews" ("reviewId", "bookingId", "clientId", "vehicleId", "rating", "comment", "createdAt")
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *
  `;
  const result = await pool.query(query, [reviewId, bookingId, clientId, vehicleId, rating, comment]);
  return result.rows[0];
}

async function getReviewByBookingId(bookingId) {
  const query = `SELECT * FROM "Reviews" WHERE "bookingId" = $1`;
  const result = await pool.query(query, [bookingId]);
  return result.rows[0];
}

async function getReviewsByVehicleId(vehicleId) {
  const query = `
    SELECT r.*, c."clientName", c."clientAvatar"
    FROM "Reviews" r
    JOIN "Clients" c ON c."clientId" = r."clientId"
    WHERE r."vehicleId" = $1
    ORDER BY r."createdAt" DESC
  `;
  const result = await pool.query(query, [vehicleId]);
  return result.rows;
}

async function getReviewedBookingIds(clientId) {
  const query = `SELECT "bookingId" FROM "Reviews" WHERE "clientId" = $1`;
  const result = await pool.query(query, [clientId]);
  return new Set(result.rows.map(r => r.bookingId));
}

module.exports = { createReview, getReviewByBookingId, getReviewsByVehicleId, getReviewedBookingIds };
