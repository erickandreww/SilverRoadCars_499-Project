const bcrypt = require('bcryptjs');
const usersModel = require('../models/users');
const clientModel = require('../models/clients');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

    const payLoad = {
      clientId: client.clientId,
      clientName: client.clientName,
      clientEmail: client.clientEmail,
      clientAvatar: client.clientAvatar,
      clientAddress: client.clientAddress,
      clientPhone: client.clientPhone,
      role: 'client'
    };

    console.log("Signing token with secret:", process.env.JWT_SECRET ? "Secret exists" : "Secret MISSING");

    const token = jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    console.log("Token generated successfully:", token.substring(0, 15) + "...");
    
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 });

    console.log("Cookie attached to response headers. Redirecting...");
    
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

    const payLoad = {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
      userRole: user.userRole,
      role: 'user'
    };

    const token = jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 });
    
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

module.exports = { loginView, loginUser, loginViewClient, loginClient, loginViewUser };
