const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Dovresti usare una chiave segreta sicura

function generateJWT(user) {
    const payload = {
        uid: user.uid,
        email: user.email,
        name: user.name,
        picture: user.picture
    };
    const expiry = new Date(new Date().toUTCString());
    expiry.setHours(expiry.getHours() + 8);
    const token = jwt.sign(payload, secretKey, { expiresIn: '8h' });

    return { token, expiry };
}

module.exports = generateJWT;