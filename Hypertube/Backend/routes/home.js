const jwtMiddleware = require('../middlewares/jwtMiddleware');
const { app } = require('../server');

app.get('/home', jwtMiddleware.verifyToken, function(req, res) {
    return res.send('home get');
});