const torrentStream = require('torrent-stream');
const trackers = require('../helpers/trackers');

var ENGINES = {};

const initEngine = async(hash, imdb, quality) => {
    if (ENGINES[hash])
        return (ENGINES[hash]);
    return new Promise((resolve, reject) => {
        try {
            let options = {
                path: `./uploads/movies/${hash}`,
                trackers: trackers
            };
            let engine = torrentStream(`magnet:?xt=urn:btih:${hash}`, options);
            engine.on('ready', async() => {
                ENGINES[hash] = engine;
                return resolve(engine);
            });
            engine.on('error', () => {
                return reject("Engine Error1");
            });
        } catch (err) {
            reject("Engine Error2");
        }
    })
};

const findstream = (engine) => {
    let files = engine.torrent.files;
    let index;
    let needToConvert = 0;
    let found = 0;
    // loop in all files and grab the movie one
    files.forEach((file, i) => {
        let filename = file.name;
        let extension = filename.substr(filename.length - 3).toUpperCase();
        if (
            extension == "MP4" || extension == "WEBM" || extension == "WMV" || extension == "3GP" || extension == "OGG" || extension == "FLV" ||
            extension == "AVI" || extension == "QuickTime" || extension == "HDV" || extension == "MPEG-TS" ||
            extension == "MPEG-2 PS" || extension == "WAV" || extension == "VOB" || extension == "LXF" || extension == "MKV") {
            index = i;
            // if the movie isn't supported we need to convert it
            (extension == "MP4" || extension == "WEBM") ? needToConvert = 0: needToConvert = 1;
            found = 1;
        }
    });
    return ({ engine: engine.files[index], file: files[index], found: found });
};

module.exports = {
    initEngine,
    findstream
}