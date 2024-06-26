const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const User = require('../models/User');
const generateJWT = require('../middleware/generateJWT');
const authenticateJWT = require('../middleware/authenticateJWT')


router.post('/verifyAuthToken', async (req, res) => {
  const token = req.body.token;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userRecord = await admin.auth().getUser(decodedToken.uid);

    const { uid, email, name, picture, sub } = decodedToken;

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        email,
        name,
        picture
      });
      await user.save();
    }

    const { token: jwtToken, expiry: expiry } = generateJWT(user);

    res.status(200).send({ message: 'Login successful', user: user, token: jwtToken, expiry: expiry });

  } catch (error) {
    console.error(error.message);
    res.status(error.code === 'auth/invalid-token' ? 401 : 500).send({ message: 'Error verifying token', error: error.message });
  }
});


router.delete('/deleteAccount', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }

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
