const resetController = require('../controllers/ResetController');
const { app } = require('../server');

app.get('/reset', function(req, res) {
    res.send('reset get');
});

app.put('/reset', resetController.reset);