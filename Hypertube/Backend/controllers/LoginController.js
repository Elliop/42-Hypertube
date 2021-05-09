const validatorHelper = require('../helpers/validatorHelper');
const statusHelper = require('../helpers/statusHelper');
const cryptHelper = require('../helpers/cryptHelper');
const jwtHelper = require('../helpers/jwtHelper');
const loginModel = require('../models/LoginModel');

async function login(req, res) {
    var status = statusHelper.ok;
    var errorCount = 0;
    var error = [];
    var alert = [];
    var data = [];

    var { username, password } = req.body;

    // Validation
    if (username === undefined || password === undefined) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid input !");
        return res.status(status).send({ error, alert, data });
    }

    if (validatorHelper.checkUsername(username) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid Username !");
    }

    if (validatorHelper.checkPassword(password) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid Password !");
    }

    // Check username and email + registration
    if (errorCount === 0) {
        // Trim + lower inputs
        username = username.trim().toLowerCase();
        password = password.trim();
        var getUser = await loginModel.getUser(username);
        if (getUser === false) {
            status = statusHelper.badRequest;
            error.push("Something gone wrong !");
            return res.status(status).send({ error, alert, data });
        }
        if (getUser[0] === undefined) {
            status = statusHelper.badRequest;
            error.push("Invalid credentials !");
            return res.status(status).send({ error, alert, data });
        } else {
            var userPassword = getUser[0].password;
            var activated = getUser[0].activated;
            if (await cryptHelper.compare(password, userPassword)) {
                if (activated === 0) {
                    status = statusHelper.badRequest;
                    error.push("Account not activated !");
                    error.push("Check your email to activate your account !");
                    return res.status(status).send({ error, alert, data });
                }
                status = statusHelper.ok;
                alert.push("Connected !");
                var token = jwtHelper.generateToken({ "username": getUser[0].username });
                data.push({ token });
                return res.status(status).send({ error, alert, data });
            }
            status = statusHelper.badRequest;
            error.push("Invalid credentials !");
            return res.status(status).send({ error, alert, data });
        }
    }
    return res.status(status).send({ error, alert, data });
}

module.exports = {
    login
};