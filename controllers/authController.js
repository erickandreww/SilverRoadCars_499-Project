const passport = require('passport');

// Triggers the Google Login redirection
exports.redirectToGoogle = passport.authenticate('google', { 
  scope: ['profile', 'email'] 
});

// Handles the response back from Google
exports.handleGoogleCallback = passport.authenticate('google', { 
  failureRedirect: '/login', 
  successRedirect: '/dashboard' 
});

exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/login');
  });
};