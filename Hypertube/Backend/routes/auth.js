var passport = require('passport');
const { app } = require('../server');

app.get('/auth/42', passport.authenticate('42'));

app.get('/auth/42/callback',
    passport.authenticate('42'),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:8081/auth?token=' + req.user.token + "&message=" + req.user.message);
    });

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:8081/auth?token=' + req.user.token + "&message=" + req.user.message);
    }
);

app.get('/auth/gitlab', passport.authenticate('gitlab'));

app.get('/auth/gitlab/callback',
    passport.authenticate('gitlab', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:8081/auth?token=' + req.user.token + "&message=" + req.user.message);
    }
);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:8081/auth?token=' + req.user.token + "&message=" + req.user.message);
    }
);