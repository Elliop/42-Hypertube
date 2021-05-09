const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
const cron = require("node-cron");
const rimraf = require('rimraf');

// Body parser setup
app.use(bodyParser.urlencoded({ extended: 'false' }));
app.use(bodyParser.json());

// Headers update
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
app.use(cors());

// Static files serving
app.use('/img', express.static(path.join(__dirname, 'uploads/pictures')));
app.use('/sub', express.static(path.join(__dirname, 'uploads/subtitles')));

// Exports
module.exports = {
    app
};

// Auth
require('./core/auth');

// Routes
require('./routes/root');
require('./routes/register');
require('./routes/reset');
require('./routes/activate');
require('./routes/login');
require('./routes/user');
require('./routes/home');
require('./routes/auth');
//remove
require('./routes/jwt');

require('./routes/library');
require('./routes/streaming');
require('./routes/subtitles');

// cronjob
var watchModel = require("./models/WatchModel");

async function deleteMovie() {
    movies = await watchModel.getMoviesToRemove();
    if (movies !== false) {
        movies.forEach(movie => {
            try {
                path = `./uploads/movies/${movie.hash}`;
                rimraf(path, function() { console.log(`Remove old unseen movies...`); });
                delete ENGINES.movie.hash;
            } catch (err) {
            }
        });
    }
}
cron.schedule("59 23 * * *", function() {
    deleteMovie();
});

deleteMovie();

// Port listner
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});