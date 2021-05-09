const validatorHelper = require('../helpers/validatorHelper');
const statusHelper = require('../helpers/statusHelper');
const jwtHelper = require('../helpers/jwtHelper');
const cryptHelper = require('../helpers/cryptHelper');
const multerHelper = require('../helpers/multerHelper');
const userModel = require('../models/UserModel');
const registerModel = require('../models/RegisterModel');
const fs = require('fs');

async function getUser(req, res) {
    var status = statusHelper.ok;
    var errorCount = 0;
    var error = [];
    var alert = [];
    var data = [];

    var { username } = req.params;

    // Validation
    if (username === undefined) {
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

    // Check username
    if (errorCount === 0) {
        // Trim + lower inputs
        username = username.trim().toLowerCase();
        var userData = await userModel.getUserByUsername(username);
        if (userData === false) {
            status = statusHelper.badRequest;
            error.push("Something gone wrong !");
            return res.status(status).send({ error, alert, data });
        } else {
            if (userData[0] !== undefined) {
                delete userData[0].password;
                delete userData[0].activationCode;
                delete userData[0].activated;
                data.push(userData[0]);
            } else {
                error.push("User not found !");
            }
        }
    }

    return res.status(status).send({ error, alert, data });
}

async function setUser(req, res) {
    var status = statusHelper.ok;
    var errorCount = 0;
    var error = [];
    var alert = [];
    var data = [];

    var { firstname, lastname, username, password, email, language } = req.body;

    // Validation
    if (firstname === undefined || lastname === undefined || username === undefined || password === undefined || email === undefined || language === undefined) {
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
        /* errorCount++;
        status = statusHelper.badRequest; */
        alert.push("(Previous picture restored)");
    }

    // Password update management
    if (validatorHelper.checkIsString(password)) {
        if (password.trim().length) {
            if (validatorHelper.checkPassword(password) === false) {
                errorCount++;
                status = statusHelper.badRequest;
                error.push("Invalid Password !");
            }
        }
    } else {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid Password !");
    }

    if (validatorHelper.checkEmail(email) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid Email !");
    }

    if (validatorHelper.checkLanguage(language) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid Language !");
    }

    if (errorCount === 0) {
        // Trim + lower inputs
        firstname = firstname.trim();
        lastname = lastname.trim();
        username = username.trim().toLowerCase();
        password = password.trim();
        email = email.trim().toLowerCase();

        // Get connected user id
        var token = req.headers.authorization;
        token = token.split(' ')[1];
        token = jwtHelper.decodeToken(token);
        var connectedUserUsername = token.username;

        // Get connected user data
        var connectedUserData = await userModel.getUserByUsername(connectedUserUsername);
        var connectedUserId = connectedUserData[0].id;
        var connectedUsername = connectedUserData[0].username;
        var connectedUserEmail = connectedUserData[0].email;
        var connectedUserPassword = connectedUserData[0].password;
        var connectedUserPicture = connectedUserData[0].picture;

        picture = connectedUserPicture;
        if (typeof req.file !== "undefined") {
            picture = req.file.filename;
        }

        // Check username and email
        var usernameCount = await registerModel.countUsername(username);
        var emailCount = await registerModel.countEmail(email);

        if (usernameCount === false || emailCount === false) {
            status = statusHelper.badRequest;
            error.push("Something gone wrong !");
            return res.status(status).send({ error, alert, data });
        } else {
            if ((usernameCount[0].COUNT === 1) && (username !== connectedUsername)) {
                status = statusHelper.badRequest;
                error.push("Username already exists !");
                return res.status(status).send({ error, alert, data });
            } else if ((emailCount[0].COUNT === 1) && (email !== connectedUserEmail)) {
                status = statusHelper.badRequest;
                error.push("Email already exists !");
                return res.status(status).send({ error, alert, data });
            } else {
                status = statusHelper.created;
                var cryptedPassword = connectedUserPassword;
                if (password.trim().length)
                    cryptedPassword = cryptHelper.crypt(password);
                var updateCheck = await userModel.setUserById(connectedUserId, username, cryptedPassword, firstname, lastname, email, language, picture);
                if (updateCheck === false) {
                    status = statusHelper.badRequest;
                    error.push("Something gone wrong !");
                    return res.status(status).send({ error, alert, data });
                }
                // Remove the old picture file
                if (fs.existsSync(multerHelper.uploadDir + "/" + connectedUserPicture) && typeof req.file !== "undefined" && connectedUserPicture)
                    fs.unlinkSync(multerHelper.uploadDir + "/" + connectedUserPicture);
                alert.push("Updated !");
                var token = jwtHelper.generateToken({ "username": username });
                data.push({ token });
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
    getUser,
    setUser
};