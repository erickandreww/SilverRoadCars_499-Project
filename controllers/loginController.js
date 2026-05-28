const bcrypt = require('bcryptjs');
const usersModel = require('../models/users');

const loginView = (req, res) => {
  res.render('login', { title: 'Login', error: null });
};

const loginUser = async (req, res, next) => {
  const { userEmail, userPassword } = req.body;

  if (!userEmail || !userPassword) {
    return res.render('login', { title: 'Login', error: 'Email and password are required' });
  }

  try {
    const user = await usersModel.getUserByEmail(userEmail);
    if (!user || !(await bcrypt.compare(userPassword, user.userPassword))) {
      return res.render('login', { title: 'Login', error: 'Invalid email or password' });
    }

    req.session.user = {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
      userRole: user.userRole,
    };

    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

module.exports = { loginView, loginUser };
