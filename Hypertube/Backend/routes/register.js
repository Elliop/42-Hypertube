const registerController = require('../controllers/RegisterController');
const { app } = require('../server');
const multerHelper = require('../helpers/multerHelper');

app.get('/register', function(req, res) {
    res.send('register get');
});

app.post('/register', multerHelper.upload.single('picture'), registerController.register);