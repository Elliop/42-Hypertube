const statusHelper = require('../helpers/statusHelper');
const jwtHelper = require('../helpers/jwtHelper');

async function verifyToken(req, res, next) {
    var status = statusHelper.badRequest;
    var error = [];
    var alert = [];
    var data = [];

    var token = req.headers.authorization;

    if (token === undefined) {
        error.push("Invalid credentials !");
        return res.status(status).send({ error, alert, data });
    }
    // Split token + verification
    token = token.split(' ')[1];
    var verifyToken = jwtHelper.verifyToken(token);
    if (verifyToken === false) {
        error.push("Invalid credentials !");
        return res.status(status).send({ error, alert, data });
    }
    next();
}

module.exports = {
    verifyToken
};