const { body, validationResult } = require("express-validator");

const userRules = () => {
  return [
    body("userName")
      .trim()
      .isLength({ min: 3 })
      .withMessage("User name must be at least 3 characters."),

    body("userEmail")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),

    body("userPassword")
      .optional({ checkFalsy: true })
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters."),
    
    body("userRole")
      .isIn(["standard", "manager"])
      .withMessage("Please choose a valid user role.")
  ];
}

const checkUserData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("users/newUser", {
      title: "Create a New User",
      errors,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userRole: req.body.userRole
    });
  }

  next();
}

const checkUpdateUserData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("users/user", {
      title: "Edit User",
      errors,
      userId: req.body.userId,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userRole: req.body.userRole
    });
  }

  next();
}

module.exports = { userRules, checkUserData, checkUpdateUserData }