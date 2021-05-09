const axios = require('axios');
const cloudscraper = require('cloudscraper');
const statusHelper = require('../../helpers/statusHelper');
const setObjectHelper = require('../../helpers/setObjectHelper');

async function getMovies(req, res) {
    var movie = [];
    var alert = [];
    var error = [];
    var status = statusHelper.ok;
    try {
        const { page, sortBy } = req.body;

        if (typeof page !== "undefined" && typeof page === "number" && page >= 1 && typeof sortBy !== "undefined" && typeof sortBy === "string") {
            // Get movies from popcorn api
            response = await axios.get('https://api.apiumadomain.com/list?sort=' + sortBy + '&short=0&cb=&quality=720p,1080p,3d&page=' + page);
            if (typeof response.data !== "undefined" && typeof response.data.MovieList !== "undefined" && response.data.MovieList.length > 0) {
                movie = setObjectHelper.popcornResToMyObject(movie, response);
            }

            // Get movies from yts api
            response = await cloudscraper.get('https://yts.mx/api/v2/list_movies.json?order_by=desc&limit=50&quality=720p,1080p,3d&page=' + page + '&sort_by=' + sortBy);
            response = JSON.parse(response);
            if (typeof response.data !== "undefined" && typeof response.data.movies !== "undefined" && typeof response.data.movies.length != "undefined" && response.data.movies.length > 0) {
                movie = setObjectHelper.ytsResToMyObject(movie, response);
            }

            if (movie.length > 0) {
                res.status(status).send({ movie, error, alert });
            } else {
                error.push("Here Something Went Wrong !");
                status = statusHelper.badRequest;
                res.status(status).send({ movie, error, alert });
            }
        }
        else {
            status = statusHelper.badRequest;
            error.push("Invalid inputs !");
            res.status(status).send({ movie, error, alert });
        }
    } catch (err) {
        console.log(err);
        error.push("Something Went Wrong !");
        status = statusHelper.badRequest;
        res.status(status).send({ movie, error, alert });
    }
}

module.exports = {
    getMovies
}