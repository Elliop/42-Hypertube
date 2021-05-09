const validatorHelper = require('../helpers/validatorHelper');
const statusHelper = require('../helpers/statusHelper');
const userModel = require('../models/UserModel');
const watchModel = require('../models/WatchModel');
const jwtHelper = require('../helpers/jwtHelper');

async function visitMovie(req, res) {
    var status = statusHelper.ok;
    var errorCount = 0;
    var error = [];
    var alert = [];
    var data = [];

    var { hash, imdb, title } = req.body;

    // Validation
    if (hash === undefined || title === undefined || imdb === undefined) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid input !");
        return res.status(status).send({ error, alert, data });
    }

    if (typeof hash !== 'string' || validatorHelper.checkLength(hash, 5, 100) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid hash!");
    }

    if (typeof title !== 'string' || validatorHelper.checkLength(title, 1, 100) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid title !");
    }

    if (typeof imdb !== 'string' || validatorHelper.checkLength(imdb, 5, 100) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid imdb Id !");
    }

    if (errorCount === 0) {
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

        var setMovie = await watchModel.setMovie(hash, imdb, title);
        if (setMovie === false) {
            status = statusHelper.badRequest;
            error.push("1Something gone wrong !");
            return res.status(status).send({ error, alert, data });
        }
        var setVisit = await watchModel.setVisit(hash, imdb, title, connectedUserUsername);
        if (setVisit === false) {
            status = statusHelper.badRequest;
            error.push("2Something gone wrong !");
            return res.status(status).send({ error, alert, data });
        }
    }
    return res.status(status).send({ error, alert, data });
}

async function getVisitMovie(req, res) {
    var status = statusHelper.ok;
    var errorCount = 0;
    var error = [];
    var alert = [];
    var data = [];

    // Validation

    if (errorCount === 0) {
        // Get connected user id
        var token = req.headers.authorization;
        token = token.split(' ')[1];
        token = jwtHelper.decodeToken(token);
        var connectedUserUsername = token.username;

        // Get connected user data
        var connectedUserData = await userModel.getUserByUsername(connectedUserUsername);

        var connectedUsername = connectedUserData[0].username;

        var getVisit = await watchModel.getVisit(connectedUserUsername);
        if (getVisit === false) {
            status = statusHelper.badRequest;
            error.push("Something gone wrong !");
            return res.status(status).send({ error, alert, data });
        }
        data = getVisit;
    }
    return res.status(status).send({ error, alert, data });
}

async function commentMovie(req, res) {
    var status = statusHelper.ok;
    var errorCount = 0;
    var error = [];
    var alert = [];
    var data = [];

    var { imdb, value } = req.body;
    // Validation
    if (value === undefined || imdb === undefined) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid input !");
        return res.status(status).send({ error, alert, data });
    }

    if (typeof value !== 'string' || validatorHelper.checkLength(value, 1, 1000) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid comment !");
    }

    if (typeof imdb !== 'string' || validatorHelper.checkLength(imdb, 5, 100) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid imdb Id !");
    }

    if (errorCount === 0) {
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

        var setComment = await watchModel.setComment(imdb, value, connectedUserUsername);
        if (setComment === false) {
            status = statusHelper.badRequest;
            error.push("Something gone wrong !");
            return res.status(status).send({ error, alert, data });
        }
    }
    return res.status(status).send({ error, alert, data });
}

async function getCommentMovie(req, res) {
    var status = statusHelper.ok;
    var errorCount = 0;
    var error = [];
    var alert = [];
    var data = [];

    var { imdb } = req.query;

    // Validation
    if (imdb === undefined) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid input !");
        return res.status(status).send({ error, alert, data });
    }

    if (typeof imdb !== 'string' || validatorHelper.checkLength(imdb, 5, 100) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid imdb Id !");
    }

    if (errorCount === 0) {

        var getComment = await watchModel.getComment(imdb);
        if (getComment === false) {
            status = statusHelper.badRequest;
            error.push("Something gone wrong !");
            return res.status(status).send({ error, alert, data });
        }
        data = getComment;
    }
    return res.status(status).send({ error, alert, data });
}

module.exports = {
    visitMovie,
    commentMovie,
    getCommentMovie,
    getVisitMovie
};