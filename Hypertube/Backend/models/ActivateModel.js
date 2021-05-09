const databaseHelper = require('../helpers/databaseHelper');

async function activate(activationCode) {
    return await databaseHelper.executeQuery("UPDATE `user` SET `activated` = 1 WHERE `activationCode` = ?", [activationCode]);
}

async function userCount(activationCode) {
    return await databaseHelper.selectQuery("SELECT COUNT(*) AS `COUNT` FROM `user` WHERE `activationCode` = ?", [activationCode]);
}

module.exports = {
    activate,
    userCount
};