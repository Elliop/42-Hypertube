var jwt = require('jsonwebtoken');

var secretKey = "Hypertube";

function generateToken(obj) {
    return jwt.sign(obj, secretKey);
}

function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey).id;
    } catch (err) {
        return false;
    }
}

function decodeToken(token) {
    return jwt.decode(token);
}

module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
    secretKey
}