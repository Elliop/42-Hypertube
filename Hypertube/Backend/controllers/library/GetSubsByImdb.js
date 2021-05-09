const axios = require('axios');
const statusHelper = require('../../helpers/statusHelper');
const subs = require('yifysubtitles-api');
const fs = require('fs');
const glob = require('glob');
const { spawnSync } = require('child_process');
const srt2vtt = require('srt-to-vtt');


async function mvFile(dir, lang, newfile) {

    glob(dir + `${lang}/*.srt`, (err, files) => {
        if (err) done(err)

        // rename the files by known names
        spawnSync('mv', [files[0], newfile]);

        // convert the type of srt to vtt
        fs.createReadStream(newfile).pipe(srt2vtt()).pipe(fs.createWriteStream(dir + lang + `/${lang}.vtt`));
    })
}

async function unzipFile(baseDir, file, newDir) {
    try {
        spawnSync('unzip', [baseDir + file, '-d', baseDir + newDir]);
    } catch (err) {
    }
}

async function createSrt(imdb, url, lang) {
    if (fs.existsSync(`./uploads/subtitles/${imdb}/`))
        return;
    try {
        await axios({
            method: "get",
            url: url,
            responseType: "stream"
        }).then(async function (response) {
            try {

                // mkdir the directory if not exists
                await fs.mkdirSync(`./uploads/subtitles/${imdb}/${lang}`, { recursive: true }, (err) => { console.log("here hhhhh", err) });

                await response.data.pipe(fs.createWriteStream(`./uploads/subtitles/${imdb}/${lang}.zip`), (err) => {
                }).on('finish', function () {

                    // unzip the zip files of subtitles
                    unzipFile(`./uploads/subtitles/${imdb}/`, `${lang}.zip`, `${lang}/`);

                    // rename the srt files to known names
                    mvFile(`./uploads/subtitles/${imdb}/`, lang, `./uploads/subtitles/${imdb}/${lang}/${lang}.srt`);

                    // delete the zip files
                    fs.unlinkSync(`./uploads/subtitles/${imdb}/${lang}.zip`);

                    /*
                        

                        // delete the srt files after convertion
                        fs.unlinkSync(`./uploads/subtitles/${imdb}/${lang}/${lang}.srt`);
                    */

                });

            } catch (err) { console.log("create subtitles folder", err) }
        });

    } catch (err) { }
}


function ifDefinedAr(subtitles) {
    return typeof subtitles !== "undefined" && typeof subtitles[0] !== "undefined" && typeof subtitles[0].ar !== "undefined" && typeof subtitles[0].ar[0] !== "undefined" && typeof subtitles[0].ar[0].url !== "undefined";
}

function ifDefinedFr(subtitles) {
    return typeof subtitles !== "undefined" && typeof subtitles[0] !== "undefined" && typeof subtitles[0].fr !== "undefined" && typeof subtitles[0].fr[0] !== "undefined" && typeof subtitles[0].fr[0].url !== "undefined";
}

function ifDefinedEn(subtitles) {
    return typeof subtitles !== "undefined" && typeof subtitles[0] !== "undefined" && typeof subtitles[0].en !== "undefined" && typeof subtitles[0].en[0] !== "undefined" && typeof subtitles[0].en[0].url !== "undefined";
}

async function getSubsByImdb(req, res) {
    var subtitles = [];
    var error = [];
    var alert = [];
    var status = statusHelper.ok;
    var founded = [];
    var sub = [];
    try {
        const { imdb } = req.body;
        if (typeof imdb !== "undefined" && typeof imdb === "string") {
            subtitles.push(await subs.search({ imdbid: imdb, limit: 'best' }));
            if (typeof subtitles.length !== "undefined" && subtitles.length > 0) {
                if (ifDefinedAr(subtitles)) {
                    createSrt(imdb, subtitles[0].ar[0].url, "ar");
                    try {
                        if (fs.existsSync(`./uploads/subtitles/${imdb}/ar/ar.vtt`)) {
                            founded.push("ar");
                            sub.push({ "lang": "ar", "file": `ar.vtt` });
                        }
                    } catch (err) {}

                }
                if (ifDefinedFr(subtitles)) {
                    createSrt(imdb, subtitles[0].fr[0].url, "fr");
                    try {
                        if (fs.existsSync(`./uploads/subtitles/${imdb}/fr/fr.vtt`)) {
                            founded.push("fr");
                            sub.push({ "lang": "fr", "file": `fr.vtt` });
                        }
                    } catch (err) {}
                }
                if (ifDefinedEn(subtitles)) {
                    createSrt(imdb, subtitles[0].en[0].url, "en");
                    try {
                        if (fs.existsSync(`./uploads/subtitles/${imdb}/en/en.vtt`)) {
                            founded.push("en");
                            sub.push({ "lang": "en", "file": `en.vtt` });
                        }
                    } catch (err) {}
                }
                if (founded.length > 0) {
                    res.status(status).send({ sub, error, alert });
                } else {
                    error.push("No subtitles found for this movie");
                    res.status(status).send({ sub, error, alert });
                }
            } else {
                error.push("No subtitles found for this movie");
                res.status(status).send({ sub, error, alert });
            }
        } else {
            // if there is something wrong with inputs
            status = statusHelper.badRequest;
            error.push("Invalid inputs !");
            res.status(status).send({ sub, error, alert });
        }
    } catch (err) {
        // if there is something crashed while processing subtitles
        status = statusHelper.badRequest;
        error.push("Something went wrong !");
        res.status(status).send({ sub, error, alert });
    }
}

module.exports = {
    getSubsByImdb
}