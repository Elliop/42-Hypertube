const Search = require('../controllers/library/Search');
const WatchMovie = require('../controllers/library/WatchMovie');
const watchController = require('../controllers/WatchController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const { app } = require("../server");
const LibraryController = require('../controllers/library/LibraryController');
const GetSubsByImdb = require('../controllers/library/GetSubsByImdb');
const SearchByTitle = require('../controllers/library/SearchByTitle');
const SearchByGender = require('../controllers/library/SearchByGender');
const SearchByImdb = require('../controllers/library/SearchByImdb');


app.get('/library', function(req, res) {
    res.send('librari get');
});


app.post('/library', LibraryController.getMovies);
app.post('/movies', SearchByTitle.moviesByTitle);
app.post('/gender', SearchByGender.movieByGender);
app.post('/imdb', SearchByImdb.movieByImdb);
app.post('/subs', GetSubsByImdb.getSubsByImdb);
app.post('/search', jwtMiddleware.verifyToken, Search.searching);
app.get('/watch', jwtMiddleware.verifyToken, WatchMovie.watchMovie);
// Movie visit route
app.post('/watch', jwtMiddleware.verifyToken, watchController.visitMovie);
app.get('/history', jwtMiddleware.verifyToken, watchController.getVisitMovie);
// Movie comment
app.post('/comment', jwtMiddleware.verifyToken, watchController.commentMovie);
app.get('/comment', jwtMiddleware.verifyToken, watchController.getCommentMovie);