const SubtitlesController = require('../controllers/SubtitlesController');
const { app } = require('../server');

app.get('/subtitles', SubtitlesController.getSubtitles);