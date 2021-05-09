const cloudscraper = require('cloudscraper');
const setObjectHelper = require('../../helpers/setObjectHelper');

async function mostRatingMovies(req, res) {
    try {
        var movie = [];
        const { page } = req.body;
        
        // Get most rating movies from yts api
        response = await cloudscraper.get('https://yts.mx/api/v2/list_movies.json?order_by=desc&sort_by=title&limit=50&page='+ page +'&quality=720p,1080p,3d&minimum_rating=8');
        response = JSON.parse(response);
        if (typeof response.data !== "undefined" && typeof response.data.movies !== "undefined" && typeof response.data.movies.length !== "undefined" && response.data.movies.length > 0) {
            movie = setObjectHelper.ytsResToMyObject(movie, response);
        }
        return movie;
    } catch (err) {}
}

module.exports = {
    mostRatingMovies
}