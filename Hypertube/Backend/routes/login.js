const loginController = require('../controllers/LoginController');
const { app } = require('../server');

app.get('/login', function(req, res) {
    res.send('login get');
});

app.post('/login', loginController.login);