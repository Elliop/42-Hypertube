const activateController = require('../controllers/ActivateController');
const { app } = require('../server');

app.get('/activate', function(req, res) {
    res.send('activate get');
});

app.put('/activate', activateController.activate);