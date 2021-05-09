const { app } = require('../server');

app.get('/', function(req, res) {
    res.send('<link href="https://fonts.googleapis.com/css?family=Open+Sans:600&display=swap" rel="stylesheet"><style>*{font-family: \'Open Sans\', sans-serif;}</style><h1>Hypertube</h1><p>API v1.0.0</p>');
});