const bcrypt = require('bcryptjs');
const clientModel = require('../models/clients');

const registerView = (req, res) => {
  res.render('register', { title: 'Register', error: null });
};

const registerClient = async (req, res, next) => {
  const { clientName, clientEmail, clientPassword, confirmPassword, clientAddress, clientPhone, driverLicenseNumber } = req.body;

  if (!clientName || !clientEmail || !clientPassword || !confirmPassword || !clientAddress || !clientPhone || !driverLicenseNumber) {
    return res.render('register', { title: 'Register', error: 'All fields are required' });
  }

  if (clientPassword !== confirmPassword) {
    return res.render('register', { title: 'Register', error: 'Passwords do not match' });
  }

  const hashPassword = await bcrypt.hash(clientPassword, 10);

  try {
    const existing = await clientModel.getClientByEmail(clientEmail);
    if (existing) {
      return res.render('register', { title: 'Register', error: 'A client with that email already exists' });
    }
    const result = await clientModel.createClient(clientName, clientEmail, hashPassword, clientAddress, clientPhone, driverLicenseNumber);
    if (!result) {
      return res.render('register', { title: 'Register', error: 'Failed to create client' });
    }
    res.redirect('/login');
  } catch (err) {
    next(err);
  }
};

module.exports = { registerView, registerClient };
