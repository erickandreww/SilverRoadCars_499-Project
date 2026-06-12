const pool = require("../config/db")
const crypto = require("crypto");

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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    
    // solve conflics problem
    const currentBookingSql = `
      SELECT *
      FROM "Bookings"
      WHERE "bookingId" = $1
        AND "bookingStatus" = 'pending'
      FOR UPDATE;
    `;

    const currentBookingResult = await client.query(currentBookingSql, [bookingId]);
    const currentBooking = currentBookingResult.rows[0];

    if (!currentBooking) {
      await client.query("ROLLBACK");
      return null;
    }

    const conflictSql = `
      SELECT *
      FROM "Bookings"
      WHERE "vehicleId" = $1
        AND "bookingId" != $2
        AND "bookingStatus" IN ('approved', 'active')
        AND "startDate" <= $4
        AND "endDate" >= $3
      LIMIT 1;
    `;

    const conflictResult = await client.query(conflictSql, [
      currentBooking.vehicleId,
      currentBooking.bookingId,
      currentBooking.startDate,
      currentBooking.endDate
    ]);

    if (conflictResult.rows.length > 0) {
      await client.query("ROLLBACK");
      return {
        conflict: true,
        booking: conflictResult.rows[0]
      };
    }

    // bookings and vehicles update
    const bookingSql = `
      UPDATE "Bookings" 
      SET 
        "approvedBy" = $1,
        "bookingStatus" = 'approved',
        "updatedAt" = NOW()
      WHERE "bookingId" = $2 AND "bookingStatus" = 'pending'
      RETURNING *
    `;

    const result = await client.query(bookingSql, [approvedBy, bookingId]);
    const booking = result.rows[0];

    if (!booking) {
      await client.query("ROLLBACK");
      return null;
    }

    const vehicleSql = `
      UPDATE "Vehicles" 
      SET 
        "availabilityStatus" = 'reserved',
        "updatedAt" = NOW()
      WHERE "vehicleId" = $1 
        AND "availabilityStatus" = 'available';
    `;

    await client.query(vehicleSql, [booking.vehicleId]);

    await client.query("COMMIT");
    return booking;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function rejectBooking(bookingId, approvedBy) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const bookingSql = `
      UPDATE "Bookings"
      SET
        "approvedBy" = $1,
        "bookingStatus" = 'rejected',
        "updatedAt" = NOW()
      WHERE "bookingId" = $2 AND "bookingStatus" = 'pending'
      RETURNING *;
    `;

    const result = await client.query(bookingSql, [approvedBy, bookingId]);
    const booking = result.rows[0];

    if (!booking) {
      await client.query("ROLLBACK");
      return null;
    }

    const vehicleSql = `
      UPDATE "Vehicles"
      SET
        "availabilityStatus" = 'available',
        "updatedAt" = NOW()
      WHERE "vehicleId" = $1;
    `;

    await client.query(vehicleSql, [booking.vehicleId]);

    await client.query("COMMIT");
    return booking;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function activateBooking(bookingId) {
  const client = await pool.connect()
  
  try {
    await client.query("BEGIN");

    const bookingSql = `
      UPDATE "Bookings"
      SET
        "bookingStatus" = 'active',
        "updatedAt" = NOW()
      WHERE "bookingId" = $1 AND "bookingStatus" = 'approved'
      RETURNING *;
    `;

    const result = await client.query(bookingSql, [bookingId]);
    const booking = result.rows[0];

    if (!booking) {
      await client.query("ROLLBACK");
      return null;
    }

    const vehicleSql = `
      UPDATE "Vehicles"
      SET 
        "availabilityStatus" = 'rented',
        "updatedAt" = NOW()
      WHERE "vehicleId" = $1
    `;

    await client.query(vehicleSql, [booking.vehicleId]);

    await client.query("COMMIT");
    return booking
  } catch (err) {
    await client.query("ROLLBACK");
    throw err
  } finally {
    client.release();
  }
}

async function cancelBooking(bookingId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const bookingSql = `
      UPDATE "Bookings"
      SET
        "bookingStatus" = 'canceled',
        "updatedAt" = NOW()
      WHERE "bookingId" = $1
        AND "bookingStatus" = 'approved'
      RETURNING *;
    `;

    const bookingResult = await client.query(bookingSql, [bookingId]);
    const booking = bookingResult.rows[0];

    if (!booking) {
      await client.query("ROLLBACK");
      return null;
    }

    const vehicleSql = `
      UPDATE "Vehicles"
      SET
        "availabilityStatus" = 'available',
        "updatedAt" = NOW()
      WHERE "vehicleId" = $1;
    `;

    await client.query(vehicleSql, [booking.vehicleId]);

    await client.query("COMMIT");
    return booking;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function closeBooking(bookingId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const bookingSql = `
      UPDATE "Bookings"
      SET
        "bookingStatus" = 'completed',
        "updatedAt" = NOW()
      WHERE "bookingId" = $1
        AND "bookingStatus" = 'active'
      RETURNING *;
    `;

    const bookingResult = await client.query(bookingSql, [bookingId]);
    const booking = bookingResult.rows[0];

    if (!booking) {
      await client.query("ROLLBACK");
      return null;
    }

    const vehicleSql = `
      UPDATE "Vehicles"
      SET
        "availabilityStatus" = 'available',
        "updatedAt" = NOW()
      WHERE "vehicleId" = $1;
    `;

    await client.query(vehicleSql, [booking.vehicleId]);

    await client.query("COMMIT");
    return booking;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function createBooking(clientId, vehicleId, startDate, endDate, totalDays, totalValue, bookingStatus) {
  const conflict = await checkBookingConflict(vehicleId, startDate, endDate);

  if (conflict) {
    return {
      conflict: true,
      booking: conflict
    };
  }

  const bookingId = crypto.randomUUID();
  
  const sql = `
    INSERT INTO "Bookings" ("bookingId", "clientId", "vehicleId", "startDate", "endDate", "totalDays", 
    "totalValue", "bookingStatus", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    RETURNING *;
  `;
  const result = await pool.query(sql, [bookingId, clientId, vehicleId, startDate, endDate, totalDays, totalValue, bookingStatus]);
  return result.rows[0];
}

async function getCurrentBookingsByClientId(clientId) {
  const sql = `
    SELECT b."bookingId", b."clientId", b."vehicleId", b."approvedBy", b."bookingStatus",
      b."startDate", b."endDate", b."totalDays", b."totalValue", b."createdAt", b."updatedAt",
      v."brand", v."model", v."plate", v."dailyPrice"
    FROM "Bookings" b
    LEFT JOIN "Vehicles" v ON b."vehicleId" = v."vehicleId"
    WHERE b."clientId" = $1 AND b."bookingStatus" = 'approved' OR b."bookingStatus" = 'active' AND b."endDate" >= CURRENT_DATE
    ORDER BY b."createdAt" DESC
  `;
  const result = await pool.query(sql, [clientId]);
  return result.rows;
}

async function getBookingHistoryByClientId(clientId) {
  const sql = `
    SELECT b."bookingId", b."clientId", b."vehicleId", b."approvedBy", b."bookingStatus",
      b."startDate", b."endDate", b."totalDays", b."totalValue", b."createdAt", b."updatedAt",
      v."brand", v."model", v."plate", v."dailyPrice"
    FROM "Bookings" b
    LEFT JOIN "Vehicles" v ON b."vehicleId" = v."vehicleId"
    WHERE b."clientId" = $1
    ORDER BY b."createdAt" DESC
  `;
  const result = await pool.query(sql, [clientId]);
  return result.rows;
}

async function checkBookingConflict(vehicleId, startDate, endDate, bookingIdToIgnore = null) {
  let sql = `
    SELECT *
    FROM "Bookings"
    WHERE "vehicleId" = $1
      AND "bookingStatus" IN ('pending', 'approved', 'active')
      AND "startDate" <= $3
      AND "endDate" >= $2
  `;

  const params = [vehicleId, startDate, endDate];

  if (bookingIdToIgnore) {
    sql += ` AND "bookingId" != $4`;
    params.push(bookingIdToIgnore);
  }

  sql += ` LIMIT 1;`;

  const result = await pool.query(sql, params);
  return result.rows[0];
}

module.exports = { getAllBookings, getBookingById, getPendingBookings, approveBooking, rejectBooking, closeBooking, 
  createBooking, getCurrentBookingsByClientId, getBookingHistoryByClientId, activateBooking, cancelBooking, checkBookingConflict }