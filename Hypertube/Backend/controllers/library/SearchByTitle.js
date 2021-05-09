const axios = require('axios');
const cloudscraper = require('cloudscraper');
const MostRatingMovies = require('./MostRatingMovies');
const statusHelper = require('../../helpers/statusHelper');
const setObjectHelper = require('../../helpers/setObjectHelper');

async function moviesByTitle(req, res) {
    var movie = [];
    var error = [];
    var alert = [];
    var status = statusHelper.ok;
    try {
        const { title, page } = req.body;

        if (typeof title !== "undefined" && typeof title === "string" && title && typeof page !== "undefined" && (typeof page === "number" || typeof page === "string") && page >= 1) {
            // get movies from popcorn api
            response = await axios.get('https://api.apiumadomain.com/list?sort=title&short=0&cb=&quality=720p,1080p,3d&page=' + page + '&keywords=' + title);
            if (typeof response.data !== "undefined" && typeof response.data.MovieList !== "undefined" && response.data.MovieList.length > 0) {
                movie = setObjectHelper.popcornResToMyObject(movie, response);
            }

            // get movies from yts api
            response = await cloudscraper.get('https://yts.mx/api/v2/list_movies.json?order_by=desc&limit=50&quality=720p,1080p,3d&query_term=' + title + '&sort_by=title&page=' + page);
            response = JSON.parse(response);
            if (typeof response.data !== "undefined" && typeof response.data.movies !== "undefined" && typeof response.data.movies.length !== "undefined" && response.data.movies.length > 0) {
                movie = setObjectHelper.ytsResToMyObject(movie, response);
            }

            // check if API's returns movies
            if (movie.length > 0) {
                res.status(status).send({ movie, error, alert });
            }
            else {
                // if no result with searching by title we get the most ratig here
                movie = await MostRatingMovies.mostRatingMovies(req, res);
                if (movie.length > 0) {
                    alert.push("No search with " + title + " we suggest u this most rating");
                    res.status(status).send({ movie, error, alert });
                }
                else {
                    error.push("Something Went Wrong !");
                    status = statusHelper.badRequest;
                    res.status(status).send({ movie, error, alert });
                }
            }
        }
        else {
            // if there is something wrong with inputs
            status = statusHelper.badRequest;
            error.push("Invalid inputs !");
            res.status(status).send({ movie, error, alert });
        }
    } catch (err) {
        error.push("Something Went Wrong !");
        status = statusHelper.badRequest;
        res.status(status).send({ movie, error, alert });
    }
}

module.exports = {
    moviesByTitle
}