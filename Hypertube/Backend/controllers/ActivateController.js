const validatorHelper = require('../helpers/validatorHelper');
const statusHelper = require('../helpers/statusHelper');
const activateModel = require('../models/ActivateModel');

async function activate(req, res) {
    var status = statusHelper.ok;
    var errorCount = 0;
    var error = [];
    var alert = [];
    var data = [];

    var { activationCode } = req.body;

    // Validation
    if (activationCode === undefined) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid input !");
        return res.status(status).send({ error, alert, data });
    }

    if (validatorHelper.checkIsString(activationCode) === false) {
        errorCount++;
        status = statusHelper.badRequest;
        error.push("Invalid input !");
    }

    // Check username and email + registration
    if (errorCount === 0) {
        var userCount = await activateModel.userCount(activationCode);
        if (userCount === false) {
            status = statusHelper.badRequest;
            error.push("Something gone wrong !");
            return res.status(status).send({ error, alert, data });
        } else {
            if (userCount[0].COUNT === 0) {
                status = statusHelper.badRequest;
                error.push("Invalid activation code !");
                return res.status(status).send({ error, alert, data });
            } else {
                status = statusHelper.created;
                var activateCheck = await activateModel.activate(activationCode);
                if (activateCheck === false) {
                    status = statusHelper.badRequest;
                    error.push("Something gone wrong !");
                    return res.status(status).send({ error, alert, data });
                }
                alert.push("Account activated !");
                return res.status(status).send({ error, alert, data });
            }
        }
    }
    return res.status(status).send({ error, alert, data });
}

module.exports = {
    activate
};