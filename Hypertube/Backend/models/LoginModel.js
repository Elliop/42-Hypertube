const databaseHelper = require('../helpers/databaseHelper');

async function getUser(username) {
    return await databaseHelper.selectQuery("SELECT * FROM `user` WHERE LOWER(`username`) = LOWER(?)", [username]);
}

module.exports = {
    getUser
};