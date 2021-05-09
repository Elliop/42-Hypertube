const axios = require('axios');
const cloudscraper = require('cloudscraper');
const statusHelper = require('../../helpers/statusHelper');
const setObjectHelper = require('../../helpers/setObjectHelper');
const MostRatingMovies = require('./MostRatingMovies');

//Get movies By gender
async function movieByGender(req, res) {
    var movie = [];
    var error = [];
    var alert = [];
    var status = statusHelper.ok;
    try {
        const { gender, page } = req.body;

        if (typeof gender !== "undefined" && typeof gender === "string" && typeof page !== "undefined" && typeof page === "number" && page >= 1) {
            // Get movies from popcorn api
            response = await axios.get('https://api.apiumadomain.com/list?sort=title&short=0&cb=&quality=720p,1080p,3d&genre=' + gender + '&page=' + page);
            if (typeof response.data !== "undefined" && typeof response.data.MovieList !== "undefined" && response.data.MovieList.length > 0) {
                movie = setObjectHelper.popcornResToMyObject(movie, response);
            }

            // Get movies from yts
            response = await cloudscraper.get('https://yts.mx/api/v2/list_movies.json?order_by=desc&limit=50&quality=720p,1080p,3d&page=' + page + '&genre=' + gender + '&sort_by=title');
            response = JSON.parse(response);
            if (typeof response.data !== "undefined" && typeof response.data.movies !== "undefined" && typeof response.data.movies.length != "undefined" && response.data.movies.length > 0) {
                movie = setObjectHelper.ytsResToMyObject(movie, response);
            }

            if (movie.length > 0) {
                res.status(status).send({ movie, error, alert });
            } else {
                movie = await MostRatingMovies.mostRatingMovies(req, res);
                if (movie.length > 0) {
                    alert.push("No search with " + gender + " we suggest u this most rating");
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
    movieByGender
}