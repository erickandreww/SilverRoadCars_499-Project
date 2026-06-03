const bcrypt = require('bcryptjs');
const usersModel = require('../models/users');
const clientModel = require('../models/clients');

const loginView = (req, res) => {
  res.render("login/login", { title: 'Login', error: null });
};
const loginViewClient = (req, res) => {
  res.render("login/loginClient", { title: 'Login', error: null });
}

const loginViewUser = (req, res) => {
  res.render("login/loginUser", { title: 'Login', error: null });
}

const loginClient = async (req, res, next) => {
  const { clientEmail, clientPassword } = req.body;

  if (!clientEmail || !clientPassword) {
    return res.render("login/loginClient", { title: 'Login', error: 'Email and password are required' });
  }
  try{
    const client = await clientModel.getClientByEmail(clientEmail);
    if (!client || !(await bcrypt.compare(clientPassword, client.clientPassword)) || !client.clientPassword) {
      return res.render("login/loginClient", { title: 'Login', error: 'Invalid email or password' });
    }
    req.session.client = {
      clientId: client.clientId,
      clientName: client.clientName,
      clientEmail: client.clientEmail,
    };
    res.redirect('/');
  }
  catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  const { userEmail, userPassword } = req.body;

  if (!userEmail || !userPassword) {
    return res.render("login/login", { title: 'Login', error: 'Email and password are required' });
  }

  try {
    const user = await usersModel.getUserByEmail(userEmail);
    if (!user || !(await bcrypt.compare(userPassword, user.userPassword)) || !user.userPassword) {
      return res.render("login/loginUser", { title: 'Login', error: 'Invalid email or password' });
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

module.exports = { loginView, loginUser, loginViewClient, loginClient, loginViewUser };
