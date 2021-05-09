const databaseHelper = require('../helpers/databaseHelper');

async function reset(username, password) {
    return await databaseHelper.executeQuery("UPDATE `user` SET `password` = ? WHERE `username` = ?", [password, username]);
}

async function userCount(username, email) {
    return await databaseHelper.selectQuery("SELECT COUNT(*) AS `COUNT` FROM `user` WHERE `username` = ? AND `email` = ?", [username, email]);
}

module.exports = {
    reset,
    userCount
};