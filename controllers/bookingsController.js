const bookingsModel = require('../models/bookings');

const getAllBookings = async (req, res, next) => {
  try {
    const data = await bookingsModel.getAllBookings();

    res.render("bookings/bookings", {
      title: "Bookings",
      errors: null,
      data
    });
  } catch (err) {
    console.error("Error getting bookings:", err);
    err.status = 500;
    next(err);
  }
}

const getBookingsRequests = async (req, res, next) => {
  try {
    const data = await bookingsModel.getPendingBookings()

    res.render("bookings/requests", {
      title: "Booking Requests",
      errors: null,
      data
    });
  } catch (err) {
    console.error("Error getting booking requests:", err);
    err.status = 500;
    next(err);
  }
}

const getBooking = async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    const data = await bookingsModel.getBookingById(bookingId);

    if (!data) {
      const err = new Error("Booking not found");
      err.status = 404;
      return next(err);
    }

    res.render("bookings/booking", {
      title: "",
      errors: null,
      data
    })
  } catch (err) {
    console.error(`Error getting booking with ID ${bookingId}:`, err);
    err.status = 500;
    next(err);
  }
}

const approveBooking = async (req, res, next) => {
  const { bookingId } = req.body;
  try {
    const approvedBy = 
      req.session?.user?.userId || 
      req.user?.userId ||
      res.locals?.sessionUser?.userId;
    
    const result = await bookingsModel.approveBooking(bookingId, approvedBy);
    
    if (!result) {
      const err = new Error("Booking could not be approved");
      err.status = 400;
      return next(err);
    }

    res.redirect(`/users/bookings/${bookingId}`);
  } catch (err) {
    console.error(`Error approving booking with ID ${bookingId}:`, err);
    err.status = 500;
    next(err);
  }
}

const rejectBooking = async (req, res, next) => {
  const { bookingId } = req.body;
  try {
    const approvedBy = 
      req.session?.user?.userId || 
      req.user?.userId ||
      res.locals?.sessionUser?.userId;
    
    const result = await bookingsModel.rejectBooking(bookingId, approvedBy);
    
    if (!result) {
      const err = new Error("Booking could not be rejected");
      err.status = 400;
      return next(err);
    }

    res.redirect(`/users/bookings/${bookingId}`);
  } catch (err) {
    console.error(`Error rejecting booking with ID ${bookingId}:`, err);
    err.status = 500;
    next(err);
  }
}

const closeBooking = async (req, res, next) => {
  const { bookingId } = req.body;
  try {
    const result = await bookingsModel.closeBooking(bookingId);
    
    if (!result) {
      const err = new Error("Booking could not be closed");
      err.status = 400;
      return next(err);
    }

    res.redirect(`/users/bookings/${bookingId}`);
  } catch (err) {
    console.error(`Error closing booking with ID ${bookingId}:`, err);
    err.status = 500;
    next(err);
  }
}

module.exports = { getAllBookings, getBookingsRequests, getBooking, approveBooking, rejectBooking, closeBooking }