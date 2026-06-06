const jwt = require("jsonwebtoken");

function getTokenFromRequest(req) {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
}

function verifyToken(req, res, next) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.authUser = decoded;
    res.locals.sessionUser = decoded;

    next()
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
}

function requireUser(req, res, next) {
  verifyToken(req, res, function () {
    if (req.authUser.role !== "user") {
      const err = new Error("Access denied");
      err.status = 403;
      return next(err);
    }

    next();
  });
}

function requireClient(req, res, next) {
  verifyToken(req, res, function () {
    if (req.authUser.role !== "client") {
      const err = new Error("Access denied");
      err.status = 403;
      return next(err);
    }

    next();
  });
}

function requireManager(req, res, next) {
  verifyToken(req, res, function () {
    if (req.authUser.role !== "user") {
      const err = new Error("Access denied");
      err.status = 403;
      return next(err);
    }

    if (req.authUser.userRole !== "manager") {
      const err = new Error("Manager access required");
      err.status = 403;
      return next(err);
    }

    next();
  });
}


module.exports = { verifyToken, requireUser, requireClient, requireManager}