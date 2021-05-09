const statusHelper = require('../helpers/statusHelper');
const yifysubtitles = require('yifysubtitles');
const fs = require('fs');

async function getSubtitles(req, res) {
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

    if (errorCount === 0) {
        const directory = `./uploads/subtitles`;
        if (!fs.existsSync(directory))
            fs.mkdirSync(directory);
        const results = await yifysubtitles(imdb, {
            path: directory,
            langs: ['en', 'fr', 'ar']
        });
        data.push(results);
    }
    return res.status(status).send({ error, alert, data });
}

module.exports = {
    getSubtitles
};