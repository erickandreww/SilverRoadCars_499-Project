const reviewsModel = require('../models/reviews');
const bookingsModel = require('../models/bookings');

const getReviewForm = async (req, res, next) => {
  const { bookingId } = req.params;
  const clientId = req.authUser.clientId;

  try {
    const booking = await bookingsModel.getBookingById(bookingId);

    if (!booking || booking.clientId !== clientId || booking.bookingStatus !== 'completed') {
      return res.redirect('/clients/bookings/history');
    }

    const existing = await reviewsModel.getReviewByBookingId(bookingId);
    if (existing) {
      return res.redirect('/clients/bookings/history');
    }

    res.render('clients/review', {
      title: 'Leave a Review',
      booking,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

const submitReview = async (req, res, next) => {
  const { bookingId } = req.params;
  const { rating, comment } = req.body;
  const clientId = req.authUser.clientId;

  try {
    const booking = await bookingsModel.getBookingById(bookingId);

    if (!booking || booking.clientId !== clientId || booking.bookingStatus !== 'completed') {
      return res.redirect('/clients/bookings/history');
    }

    const existing = await reviewsModel.getReviewByBookingId(bookingId);
    if (existing) {
      return res.redirect('/clients/bookings/history');
    }

    const parsedRating = parseInt(rating);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      return res.render('clients/review', {
        title: 'Leave a Review',
        booking,
        error: 'Please select a rating between 1 and 5.',
      });
    }

    await reviewsModel.createReview(bookingId, clientId, booking.vehicleId, parsedRating, comment || '');
    res.redirect('/clients/bookings/history?reviewed=1');
  } catch (err) {
    next(err);
  }
};

module.exports = { getReviewForm, submitReview };
