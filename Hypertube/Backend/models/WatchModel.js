const databaseHelper = require('../helpers/databaseHelper');

async function setMovie(hash, imdb, title) {
    return await databaseHelper.executeQuery("INSERT IGNORE INTO `movie` (`hash`,`imdb`,`title`) VALUES (?,?,?)", [hash, imdb, title]);
}

async function setVisit(hash, imdb, title, username) {
    return await databaseHelper.executeQuery("INSERT INTO `visit` (`hash`,`imdb`,`title`,`username`) VALUES (?,?,?,?)", [hash, imdb, title, username]);
}

async function setComment(imdb, value, username) {
    return await databaseHelper.executeQuery("INSERT INTO `comment` (`imdb`,`value`,`username`) VALUES (?,?,?)", [imdb, value, username]);
}

async function getComment(imdb) {
    return await databaseHelper.selectQuery("SELECT * FROM `comment` WHERE `imdb` = ?", [imdb]);
}

async function getVisit(username) {
    return await databaseHelper.selectQuery("SELECT * FROM `visit` WHERE `username` = ?", [username]);
}

async function getMoviesToRemove() {
    return await databaseHelper.selectQuery("SELECT `hash` FROM (SELECT `hash`, MAX(`lastVisit`) `lastVisit` FROM `visit` GROUP BY `hash`) AS `T` WHERE (TIMESTAMPDIFF(MONTH, `T`.`lastVisit`, NOW()) > 1)", []);
}

module.exports = {
    setMovie,
    setVisit,
    setComment,
    getComment,
    getMoviesToRemove,
    getVisit
};