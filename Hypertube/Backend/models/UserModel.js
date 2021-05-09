const databaseHelper = require('../helpers/databaseHelper');

async function getUserByUsername(username) {
    return await databaseHelper.selectQuery("SELECT * FROM `user` WHERE LOWER(`username`) = LOWER(?)", [username]);
}

async function getUserById(id) {
    return await databaseHelper.selectQuery("SELECT * FROM `user` WHERE `id` = ?", [id]);
}

async function getUserCountBy42Id(id) {
    return await databaseHelper.selectQuery("SELECT COUNT(*) AS `COUNT` FROM `user` WHERE `42` = ?", [id]);
}

async function getUserCountByGithubId(id) {
    return await databaseHelper.selectQuery("SELECT COUNT(*) AS `COUNT` FROM `user` WHERE `github` = ?", [id]);
}

async function getUserCountByGitlabId(id) {
    return await databaseHelper.selectQuery("SELECT COUNT(*) AS `COUNT` FROM `user` WHERE `gitlab` = ?", [id]);
}

async function getUserCountByGoogleId(id) {
    return await databaseHelper.selectQuery("SELECT COUNT(*) AS `COUNT` FROM `user` WHERE `google` = ?", [id]);
}

async function getUserByGoogleId(id) {
    return await databaseHelper.selectQuery("SELECT * FROM `user` WHERE `google` = ?", [id]);
}

async function getUserByGitlabId(id) {
    return await databaseHelper.selectQuery("SELECT * FROM `user` WHERE `gitlab` = ?", [id]);
}

async function getUserByGithubId(id) {
    return await databaseHelper.selectQuery("SELECT * FROM `user` WHERE `github` = ?", [id]);
}

async function getUserBy42Id(id) {
    return await databaseHelper.selectQuery("SELECT * FROM `user` WHERE `42` = ?", [id]);
}

async function setUserById(id, username, password, firstname, lastname, email, language, picture) {
    return await databaseHelper.executeQuery("UPDATE `user` SET `username` = ?,`password` = ?,`firstname` = ?,`lastname` = ?, `email` = ?, `language` = ?,`picture` = ? WHERE `id` = ?", [username, password, firstname, lastname, email, language, picture, id]);
}

module.exports = {
    getUserByUsername,
    getUserById,
    setUserById,
    getUserCountBy42Id,
    getUserCountByGithubId,
    getUserCountByGitlabId,
    getUserCountByGoogleId,
    getUserBy42Id,
    getUserByGithubId,
    getUserByGitlabId,
    getUserByGoogleId
};