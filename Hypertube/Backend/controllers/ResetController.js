const validatorHelper = require('../helpers/validatorHelper');
const statusHelper = require('../helpers/statusHelper');
const mailHelper = require('../helpers/mailHelper');
const cryptHelper = require('../helpers/cryptHelper');
const uniqidHelper = require('../helpers/uniqidHelper');
const resetModel = require('../models/ResetModel');

async function reset(req, res) {
    var status = statusHelper.ok;
    var errorCount = 0;
    var error = [];
    var alert = [];
    var data = [];

    var { email, username } = req.body;

    // Validation
    if (username === undefined || email === undefined) {
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

    if (validatorHelper.checkEmail(email) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid Email !");
    }

    // Check username and email + registration
    if (errorCount === 0) {
        // Trim + lower inputs
        username = username.trim().toLowerCase();
        email = email.trim().toLowerCase();
        var userCount = await resetModel.userCount(username, email);
        if (userCount === false) {
            status = statusHelper.badRequest;
            error.push("Something gone wrong !");
            return res.status(status).send({ error, alert, data });
        } else {
            if (userCount[0].COUNT === 0) {
                status = statusHelper.badRequest;
                error.push("User does not exist !");
                return res.status(status).send({ error, alert, data });
            } else {
                status = statusHelper.created;
                var newPassword = "0Pw" + uniqidHelper.generateUniqid();
                var cryptedPassword = cryptHelper.crypt(newPassword);
                var resetRes = 'Your new password is ' + newPassword;
                var resetCheck = await resetModel.reset(username, cryptedPassword);
                if (resetCheck === false) {
                    status = statusHelper.badRequest;
                    error.push("Something gone wrong !");
                    return res.status(status).send({ error, alert, data });
                }
                mailHelper.sendEmail(email, "Account reset", resetRes);
                alert.push("Account reset successful !");
                alert.push("Check your email to reset your account !");
                return res.status(status).send({ error, alert, data });
            }
        }
    }

    return res.status(status).send({ error, alert, data });
}

module.exports = {
    reset
};