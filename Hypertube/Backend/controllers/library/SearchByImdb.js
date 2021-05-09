const axios = require('axios');
const cloudscraper = require('cloudscraper');
const statusHelper = require('../../helpers/statusHelper');
const setObjectHelper = require('../../helpers/setObjectHelper');

async function movieByImdb(req, res) {
    var movie = [];
    var error = [];
    var alert = [];
    var status = statusHelper.ok;
    try {
        const { id, img } = req.body;

        if (typeof id !== "undefined" && typeof id === "string" && id && typeof img !== "undefined" && typeof img === "string" && img) {
            // Get the movie information from yts api
            if (img.includes('yts') === true) {
                response = await cloudscraper.get('https://yts.mx/api/v2/movie_details.json?movie_id=' + id);
                response = JSON.parse(response);
                if (typeof response.data !== "undefined" && typeof response.data.movie !== "undefined") {
                    movie = setObjectHelper.movieYtsResToMyObject(movie, response);
                }
                if (movie.length > 0) {
                    alert.push("OK");
                    res.status(status).send({ movie, error, alert });
                } else {
                    error.push("Something Went Wrong !");
                    status = statusHelper.badRequest;
                    res.status(status).send({ movie, error, alert });
                }
            }
            // Get the movie information from popcorn api
            else {
                response = await axios.get('https://api.apiumadomain.com/list?keywords=' + id);
                if (typeof response.data !== "undefined" && typeof response.data.MovieList !== "undefined" && response.data.MovieList.length > 0) {
                    movie = setObjectHelper.popcornResToMyObject(movie, response);
                }
                if (movie.length > 0) {
                    alert.push("OK");
                    res.status(status).send({ movie, error, alert });
                } else {
                    error.push("Something Went Wrong !");
                    status = statusHelper.badRequest;
                    res.status(status).send({ movie, error, alert });
                }
            }
        }
        else {
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
    movieByImdb
}