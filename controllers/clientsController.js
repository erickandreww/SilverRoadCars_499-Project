const clientModel = require('../models/clients');
const jwt = require('jsonwebtoken');

const homeController = async (req, res) => {
  res.render("clients/client", { title: 'Client Home', error: null });
}
const profileController = async (req, res) => {
  res.render("clients/profile", { title: 'Client Profile', error: null });
}

const editviewController = async (req, res) => {
  res.render("clients/editProfile", { title: 'Edit Profile', error: null });
}

const editProfileController = async (req, res) => {
    const { clientName, clientEmail, clientAddress, clientPhone } = req.body;
    const clientId = req.authUser.clientId;
    console.log("Received profile update data:", { clientId, clientName, clientEmail, clientAddress, clientPhone });

    try {
        let finalAvatarPath = req.authUser.clientAvatar;
        if (req.file) {
            finalAvatarPath = `/uploads/${req.file.filename}`;
            console.log("New avatar uploaded:", finalAvatarPath);
        } else {
            console.log("No new avatar uploaded, keeping existing:", finalAvatarPath);
        }
       const client = await clientModel.updateClientProfile(clientId, clientName, clientEmail, clientAddress, clientPhone, finalAvatarPath);
       console.log("Updated client profile:", client);

          const payLoad = {
              clientId: client.clientId,
              clientName: client.clientName,
              clientEmail: client.clientEmail,
              clientAvatar: finalAvatarPath,
              clientAddress: client.clientAddress,
              clientPhone: client.clientPhone,
              role: 'client'
            };
        
            const token = jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 });
        
        res.redirect('/clients/profile');
    } catch (err) {
        console.error("Error updating client profile:", err);
        res.render("clients/editProfile", { title: 'Edit Profile', error: 'Failed to update profile. Please try again.' });
    }
}

module.exports = { homeController, profileController, editviewController, editProfileController };