const stream = require("./streamController");

//Timeout Promise
const promiseTimeout = (ms, promise) => {
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in ' + ms + 'ms.')
        }, ms)
    })
    return Promise.race([
        promise,
        timeout
    ])
}

async function piping(req, res) {
    try {
        let { hash, imdb, quality } = req.query;
        let init = promiseTimeout(20000, stream.initEngine(hash, imdb, quality));

        init.then(engine => {
            let movie = stream.findstream(engine);
            if (movie.found == 1) {
                try {
                    // grab the request headers
                    let range = "bytes=0-";
                    if (req.headers.range !== undefined)
                        range = req.headers.range;

                    let positions = range.replace(/bytes=/, "").split("-");
                    let start = parseInt(positions[0], 10);
                    let end = positions[1] ? parseInt(positions[1], 10) : movie.file.length - 1;
                    let chunksize = (end - start) + 10;

                    // Send res
                    res.writeHead(206, {
                        "Content-Range": "bytes " + start + "-" + end + "/" + movie.file.length,
                        "Accept-Ranges": "bytes",
                        "Content-Length": chunksize,
                        "Content-Type": "video/mp4"
                    });
                    let movieStream = movie.engine.createReadStream({ start: start, end: end });
                    movieStream.pipe(res);
                } catch (err) {
                    res.end();
                }

            } else {
                res.end();
            }

        }).catch(err => {
            res.end();
        });
    } catch (err) {
        res.end();
    }
}

module.exports = {
    piping,
}