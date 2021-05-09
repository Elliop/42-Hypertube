const axios = require('axios');
const cloudscraper = require('cloudscraper');
const statusHelper = require('../../helpers/statusHelper');
const setObjectHelper = require('../../helpers/setObjectHelper');



async function searching(req, res) {
    var movie = [];
    var error = [];
    var alert = [];
    var status = statusHelper.ok;
    try {
        const { gender, page, title, sortBy } = req.body;

        if (typeof title !== "undefined" && typeof title === "string"
            && typeof page !== "undefined" && typeof page === "string" && page >= 1
            && typeof gender !== "undefined" && typeof gender === "string"
            && typeof sortBy !== "undefined" && typeof sortBy === "string" && sortBy) {

            // get movies from popcorn
            response = await axios.get('https://api.apiumadomain.com/list?sort=' + sortBy + '&short=0&genre=' + gender + '&cb=&quality=720p,1080p,3d&page=' + page + '&keywords=' + title);
            if (typeof response.data !== "undefined" && typeof response.data.MovieList !== "undefined" && response.data.MovieList.length > 0) {
                movie = setObjectHelper.popcornResToMyObject(movie, response);
            }

            // get movies from yts
            response = await cloudscraper.get('https://yts.mx/api/v2/list_movies.json?limit=50&quality=720p,1080p,3d&query_term=' + title + '&page=' + page + '&genre=' + gender + '&sort_by=' + sortBy);
            response = JSON.parse(response);
            if (typeof response.data !== "undefined" && typeof response.data.movies !== "undefined" && typeof response.data.movies.length != "undefined" && response.data.movies.length > 0) {
                movie = setObjectHelper.ytsResToMyObject(movie, response);
            }

            if (movie.length === 0)
                alert.push("No movies founded");
            res.status(status).send({ movie, error, alert });
        } else {
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
    searching
}