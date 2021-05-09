const databaseHelper = require('../helpers/databaseHelper');

async function countUsername(username) {
    return await databaseHelper.selectQuery("SELECT COUNT(*) AS `COUNT` FROM `user` WHERE LOWER(`username`) = LOWER(?)", [username]);
}

async function countEmail(email) {
    return await databaseHelper.selectQuery("SELECT COUNT(*) AS `COUNT` FROM `user` WHERE LOWER(`email`) = LOWER(?)", [email]);
}

async function register(firstname, lastname, username, password, email, picture, activationCode) {
    return await databaseHelper.executeQuery("INSERT INTO `user` (`firstname`, `lastname`, `username`, `password`, `email`, `picture`,`activationCode`) VALUES (?,?,?,?,?,?,?)", [firstname, lastname, username, password, email, picture, activationCode]);
}

async function registerUserByOauth(firstname, lastname, username, password, email, picture, activationCode, activated, _42, github, gitlab, google) {
    return await databaseHelper.executeQuery("INSERT INTO `user` (`firstname`, `lastname`, `username`, `password`, `email`, `picture`,`activationCode`, `activated`, `42`, `github`, `gitlab`, `google`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [firstname, lastname, username, password, email, picture, activationCode, activated, _42, github, gitlab, google]);
}

module.exports = {
    countUsername,
    countEmail,
    register,
    registerUserByOauth
};