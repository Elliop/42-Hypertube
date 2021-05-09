const { app } = require('../server');
const jwtHelper = require('../helpers/jwtHelper');

app.post('/jwt', function(req, res) {
    var token = req.headers.authorization;

    if (token === undefined) {
        return res.send(false);
    }
    // Split token + verification
    token = token.split(' ')[1];
    var verifyToken = jwtHelper.verifyToken(token);
    if (verifyToken === false) {
        return res.send(false);
    }
    return res.send(true);
});