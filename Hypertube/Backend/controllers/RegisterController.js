const validatorHelper = require('../helpers/validatorHelper');
const statusHelper = require('../helpers/statusHelper');
const mailHelper = require('../helpers/mailHelper');
const cryptHelper = require('../helpers/cryptHelper');
const uniqidHelper = require('../helpers/uniqidHelper');
const registerModel = require('../models/RegisterModel');
const fs = require('fs');

async function register(req, res) {
    var status = statusHelper.ok;
    var errorCount = 0;
    var error = [];
    var alert = [];
    var data = [];

    var { firstname, lastname, username, password, email } = req.body;

    // Validation
    if (firstname === undefined || lastname === undefined || username === undefined || password === undefined || email === undefined) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid input !");
        return res.status(status).send({ error, alert, data });
    }

    if (validatorHelper.checkName(firstname) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid Firstname !");
    }

    if (validatorHelper.checkName(lastname) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid Lastname !");
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

    if (validatorHelper.checkEmail(email) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid Email !");
    }

    // Picture validation
    if (typeof req.file !== "undefined") {
        if (typeof req.file.path === "undefined") {
            errorCount++;
            status = statusHelper.badRequest;
            error.push("Picture file error !");
        } else if (validatorHelper.checkImage(req.file.path) === false) {
            if (fs.existsSync(req.file.path))
                fs.unlinkSync(req.file.path);
            errorCount++;
            status = statusHelper.badRequest;
            error.push("Picture type error !");
        }
    } else {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Picture error !");
    }

    // Check username and email + registration
    if (errorCount === 0) {
        picture = req.file.filename;
        // Trim + lower inputs
        firstname = firstname.trim();
        lastname = lastname.trim();
        username = username.trim().toLowerCase();
        password = password.trim();
        email = email.trim().toLowerCase();
        var usernameCount = await registerModel.countUsername(username);
        var emailCount = await registerModel.countEmail(email);
        if (usernameCount === false || emailCount === false) {
            status = statusHelper.badRequest;
            error.push("Something gone wrong !");
            // Remove uploaded picture
            if (fs.existsSync(req.file.path))
                fs.unlinkSync(req.file.path);
            return res.status(status).send({ error, alert, data });
        } else {
            if (usernameCount[0].COUNT === 1) {
                status = statusHelper.badRequest;
                error.push("Username already exists !");
                // Remove uploaded picture
                if (fs.existsSync(req.file.path))
                    fs.unlinkSync(req.file.path);
                return res.status(status).send({ error, alert, data });
            } else if (emailCount[0].COUNT === 1) {
                status = statusHelper.badRequest;
                error.push("Email already exists !");
                // Remove uploaded picture
                if (fs.existsSync(req.file.path))
                    fs.unlinkSync(req.file.path);
                return res.status(status).send({ error, alert, data });
            } else {
                status = statusHelper.created;
                var cryptedPassword = cryptHelper.crypt(password);
                var activationCode = uniqidHelper.generateUniqid();
                var activationLink = 'http://localhost:8081/token?activationCode=' + activationCode;
                var registerCheck = await registerModel.register(firstname, lastname, username, cryptedPassword, email, picture, activationCode);
                if (registerCheck === false) {
                    status = statusHelper.badRequest;
                    error.push("Something gone wrong !");
                    // Remove uploaded picture
                    if (fs.existsSync(req.file.path))
                        fs.unlinkSync(req.file.path);
                    return res.status(status).send({ error, alert, data });
                }
                mailHelper.sendEmail(email, "Account activation", "<a href=" + activationLink + ">Click here to activate your account</a>");
                alert.push("Registred !");
                alert.push("Check your email to activate your account !");
                return res.status(status).send({ error, alert, data });
            }
        }
    }

    // Remove picture after validation test
    if (errorCount > 0) {
        if (typeof req.file !== "undefined")
            if (typeof req.file.path !== "undefined")
                if (fs.existsSync(req.file.path))
                    fs.unlinkSync(req.file.path);
    }

    return res.status(status).send({ error, alert, data });
}

module.exports = {
    register
};