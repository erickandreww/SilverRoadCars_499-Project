const passport = require('passport');
const jwt = require('jsonwebtoken');


exports.redirectToGoogle = passport.authenticate('google', { 
  scope: ['profile', 'email'] 
});


exports.handleGoogleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, client, info) => {
    if (err) { 
      return next(err); 
    }
    if (!client) { 
      return res.redirect('/login?error=Google authentication failed'); 
    }

    // 1. Establish the payload
    const payLoad = {
      clientId: client.clientId,
      clientName: client.clientName,
      clientEmail: client.clientEmail,
      role: 'client'
    };

    // 2. Sign the JSON Web Token
    const token = jwt.sign(payLoad, process.env.JWT_SECRET, { 
      expiresIn: process.env.JWT_EXPIRES_IN || '1d' 
    });

    // 3. Set the cookie
    res.cookie('token', token, {
      httpOnly: true, // Safeguards against XSS attacks
      secure: process.env.NODE_ENV === 'production', // true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    });

    // 4. Redirect to the landing page or dashboard
    res.redirect('/');
  })(req, res, next);
};

// Clear cookies along with standard session logs during logout
exports.logoutUser = (req, res, next) => {
  res.clearCookie('token'); // Destroys the client's JWT cookie

  req.logout((err) => {
    if (err) { return next(err); }
    req.session.destroy(() => {
      res.redirect('/login');
    });
  });
};