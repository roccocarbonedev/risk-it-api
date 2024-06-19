const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const User = require('../models/User');


router.post('/verifyAuthToken', async (req, res) => {
  const token = req.body.token;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture, sub } = decodedToken;

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        email: decodedToken['firebase']['sign_in_provider'] === "apple.com" ? `${sub}@apple.com` : email,
        name: decodedToken['firebase']['sign_in_provider'] === "apple.com" ? sub : name,
        picture: decodedToken['firebase']['sign_in_provider'] === "apple.com" ? null : picture,
      });
      await user.save();
    }

    //TODO: GENERARE TOKEN DI AUTENTICAZZIONE DELLE CHIAMATE

    res.status(200).send({ message: 'Login successful', user });

  } catch (error) {
    console.error(error.message);
    res.status(error.code === 'auth/invalid-token' ? 401 : 500).send({ message: 'Error verifying token', error: error.message });
  }
});


router.delete('/deleteAccount', async (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid } = decodedToken;

    await admin.auth().deleteUser(uid);

    await User.findOneAndDelete({ uid });

    res.status(200).send({ message: 'Account deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: 'Error deleting account', error: error.message });
  }
});


module.exports = router;
