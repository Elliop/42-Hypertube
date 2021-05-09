const userController = require('../controllers/UserController');
const { app } = require('../server');
const multerHelper = require('../helpers/multerHelper');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

app.get('/user/:username', jwtMiddleware.verifyToken, userController.getUser);
app.put('/user', jwtMiddleware.verifyToken, multerHelper.upload.single('picture'), userController.setUser);