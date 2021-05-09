const pipeController = require('../controllers/pipeController');
const { app } = require('../server')

app.get('/stream', pipeController.piping);
app.post('/stream', pipeController.piping);