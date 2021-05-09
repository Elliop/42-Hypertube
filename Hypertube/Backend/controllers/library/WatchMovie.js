const axios = require('axios');
const cloudscraper = require('cloudscraper');
const statusHelper = require('../../helpers/statusHelper');
const setObjectHelper = require('../../helpers/setObjectHelper');

async function watchMovie(req, res) {
    var movie = [];
    var error = [];
    var alert = [];
    var status = statusHelper.ok;
    try {
        const { id, api } = req.query;
       
        if (typeof id === "string" && typeof api === "string" && id && api) {
            if (api === "yts") {
                try {
                    response = await cloudscraper.get('https://yts.mx/api/v2/movie_details.json?movie_id=' + id);
                    response = JSON.parse(response);
                    if (typeof response.data !== "undefined" && typeof response.data.movie !== "undefined") {
                        movie = setObjectHelper.movieYtsResToMyObject(movie, response);
                    }
                    if (movie.length > 0) {
                        return res.status(status).send({ movie, error, alert });
                    } else {
                        error.push(" HEre hh Something Went Wrong !");
                        status = statusHelper.badRequest;
                        return res.status(status).send({ movie, error, alert });
                    }
                } catch (err) {
                    error.push("Something Went Wrong !");
                    status = statusHelper.badRequest;
                    return res.status(status).send({ movie, error, alert });
                }
            }
            else if (api === "pc") {
                try {
                    response = await axios.get('https://api.apiumadomain.com/list?keywords=' + id);
                    if (typeof response.data !== "undefined" && typeof response.data.MovieList !== "undefined" && response.data.MovieList.length > 0) {
                        movie = setObjectHelper.popcornResToMyObject(movie, response);
                    }
                    if (movie.length > 0) {
                        if (movie.length === 1)
                            return res.status(status).send({ movie, error, alert });
                        else {
                            movie = movie[0];
                            return res.status(status).send({ movie, error, alert });
                        }
                    } else {
                        error.push("Something Went Wrong !");
                        status = statusHelper.badRequest;
                        return res.status(status).send({ movie, error, alert });
                    }
                } catch (err) {
                    error.push("Something Went Wrong !");
                    status = statusHelper.badRequest;
                    return res.status(status).send({ movie, error, alert });
                }
            }
            else {
                error.push("Something Went Wrong !");
                status = statusHelper.badRequest;
                return res.status(status).send({ movie, error, alert });
            }
        } else {
            error.push("Invalid inputs !");
            status = statusHelper.badRequest;
            return res.status(status).send({ movie, error, alert });
        }
    } catch (err) {
        error.push("Something Went Wrong !");
        status = statusHelper.badRequest;
        return res.status(status).send({ movie, error, alert });
    }
}

module.exports = {
    watchMovie
}