const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");
const User = require('../models/User');

// Rotta di autenticazione Google
router.post('/google', async (req, res) => {
  const token = req.body.token;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

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

    res.status(200).send({ message: 'Login successful', user });
  } catch (error) {
    console.log(error.message)
    res.status(401).send({ message: 'Invalid token', error: error.message });
  }
});

module.exports = router;
