const pool = require("../config/db")

async function getAllBookings() {
  const sql = `
    SELECT b."bookingId", b."clientId", b."vehicleId", b."approvedBy", b."bookingStatus", 
      b."startDate", b."endDate", b."totalDays", b."totalValue", b."createdAt", b."updatedAt",
      c."clientName", c."clientEmail", c."clientPhone",
      v."brand", v."model", v."plate", v."dailyPrice",
      u."userName" AS "approvedByName"
    FROM "Bookings" b 
    LEFT JOIN "Clients" c ON b."clientId" = c."clientId"
    LEFT JOIN "Vehicles" v ON b."vehicleId" = v."vehicleId"
    LEFT JOIN "Users" u ON b."approvedBy" = u."userId"
    ORDER BY b."createdAt" DESC
  `;
  const result = await pool.query(sql);
  return result.rows;
}

async function getBookingById(bookingId) {
  const sql = `
    SELECT b."bookingId", b."clientId", b."vehicleId", b."approvedBy", b."bookingStatus", 
      b."startDate", b."endDate", b."totalDays", b."totalValue", b."createdAt", b."updatedAt",
      c."clientName", c."clientEmail", c."clientPhone", c."clientAddress",
      v."brand", v."model", v."plate", v."dailyPrice", v."year", v."color", 
      v."category", v."transmission",v."fuelType", v."seats", 
      u."userName" AS "approvedByName"
    FROM "Bookings" b 
    LEFT JOIN "Clients" c ON b."clientId" = c."clientId"
    LEFT JOIN "Vehicles" v ON b."vehicleId" = v."vehicleId"
    LEFT JOIN "Users" u ON b."approvedBy" = u."userId"
    WHERE b."bookingId" = $1
  `;
  const result = await pool.query(sql, [bookingId]);
  return result.rows[0];
}

async function getPendingBookings() {
  const sql = `
    SELECT b."bookingId", b."clientId", b."vehicleId", b."approvedBy", b."bookingStatus", 
      b."startDate", b."endDate", b."totalDays", b."totalValue", b."createdAt", b."updatedAt",
      c."clientName", c."clientEmail", c."clientPhone",
      v."brand", v."model", v."plate", v."dailyPrice"
    FROM "Bookings" b 
    LEFT JOIN "Clients" c ON b."clientId" = c."clientId"
    LEFT JOIN "Vehicles" v ON b."vehicleId" = v."vehicleId"
    WHERE b."bookingStatus" = 'pending'
    ORDER BY b."createdAt" DESC
  `;
  const result = await pool.query(sql);
  return result.rows;
}

async function approveBooking(bookingId, approvedBy) {
  const sql = `
    UPDATE "Bookings" 
    SET 
      "approvedBy" = $1,
      "bookingStatus" = 'approved',
      "updatedAt" = NOW()
    WHERE "bookingId" = $2 AND "bookingStatus" = 'pending'
    RETURNING *;
  `;

  const result = await pool.query(sql, [approvedBy, bookingId]);
  return result.rows[0]
}

async function rejectBooking(bookingId, approvedBy) {
  const sql = `
    UPDATE "Bookings" 
    SET 
      "approvedBy" = $1,
      "bookingStatus" = 'rejected',
      "updatedAt" = NOW()
    WHERE "bookingId" = $2 AND "bookingStatus" = 'pending'
    RETURNING *;
  `;

  const result = await pool.query(sql, [approvedBy, bookingId]);
  return result.rows[0]
}

async function closeBooking(bookingId) {
  const sql = `
    UPDATE "Bookings"
    SET
      "bookingStatus" = 'completed',
      "updatedAt" = NOW()
    WHERE "bookingId" = $1
      AND "bookingStatus" = 'active'
    RETURNING *;
  `;

  const result = await pool.query(sql, [bookingId]);
  return result.rows[0];
}

module.exports = { getAllBookings, getBookingById, getPendingBookings, approveBooking, rejectBooking, closeBooking }