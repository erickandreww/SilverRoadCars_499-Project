const bcrypt = require('bcryptjs');
const usersModel = require('../models/users');

const registerView = (req, res) => {
  res.render('register', { title: 'Register', error: null });
};

const registerUser = async (req, res, next) => {
  const { userName, userEmail, userPassword, confirmPassword } = req.body;

  if (!userName || !userEmail || !userPassword || !confirmPassword) {
    return res.render('register', { title: 'Register', error: 'All fields are required' });
  }

  if (userPassword !== confirmPassword) {
    return res.render('register', { title: 'Register', error: 'Passwords do not match' });
  }

  if (userPassword.length < 6) {
    return res.render('register', { title: 'Register', error: 'Password must be at least 6 characters' });
  }

  try {
    const existing = await usersModel.getUserByEmail(userEmail);
    if (existing) {
      return res.render('register', { title: 'Register', error: 'An account with that email already exists' });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    await usersModel.createUser(userName, userEmail, hashedPassword);

    res.redirect('/login');
  } catch (err) {
    next(err);
  }
};

module.exports = { registerView, registerUser };
