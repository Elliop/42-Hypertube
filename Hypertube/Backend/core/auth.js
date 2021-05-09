var passport = require('passport');
var FortyTwoStrategy = require('passport-42').Strategy;
var GithubStrategy = require('passport-github').Strategy;
var GitlabStrategy = require('passport-gitlab2').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/UserModel');
const { app } = require('../server');
const keys = require('../config/keys');
const cryptHelper = require('../helpers/cryptHelper');
const uniqidHelper = require('../helpers/uniqidHelper');
const jwtHelper = require('../helpers/jwtHelper');
const registerModel = require('../models/RegisterModel');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

app.use(passport.initialize());

passport.use(new FortyTwoStrategy({
        clientID: keys._42.clientID,
        clientSecret: keys._42.clientSecret,
        callbackURL: keys._42.callbackURL
    },
    async function(accessToken, refreshToken, profile, cb) {
        try {
            var user = null;
            var email = null;
            const username = profile.username;
            const password = "Abcd1234";
            var cryptedPassword = cryptHelper.crypt(password);
            const firstname = profile.name.givenName;
            const lastname = profile.name.familyName;
            if (typeof profile.emails !== "undefined" && typeof profile.emails[0] !== "undefined") {
                email = profile.emails[0].value;
            } else {
                user = { "token": "", "message": "Email is not public !" };
                return cb(null, user);
            }
            const picture = "";
            const _42 = profile.id;
            const activationCode = uniqidHelper.generateUniqid();
            const activated = 1;

            var userCount = await userModel.getUserCountBy42Id(profile.id);
            if (userCount === false) {
                //console.log("login fail");
                user = { "token": "", "message": "Login fail !" };
            } else {
                if (userCount[0].COUNT === 0) {
                    //console.log("creating user ...");
                    var usernameCount = await registerModel.countUsername(username);
                    var emailCount = await registerModel.countEmail(email);
                    if (usernameCount === false || emailCount === false) {
                        //console.log("error");
                    } else if (usernameCount[0].COUNT === 0 && emailCount[0].COUNT === 0) {
                        var registerUserCheck = await registerModel.registerUserByOauth(firstname, lastname, username, cryptedPassword, email, picture, activationCode, activated, _42, "", "", "");
                        if (registerUserCheck === false) {
                            //console.log("error .");
                        } else {
                            user = { "token": jwtHelper.generateToken({ "username": username }), "message": "Registered !" };
                        }
                    } else {
                        //console.log("email / username exists");
                        user = { "token": "", "message": "Registration fail !" };
                    }
                } else {
                    //console.log("login...");
                    var getUser = await userModel.getUserBy42Id(profile.id);
                    if (getUser === false) {
                        user = { "token": "", "message": "Login fail !" };
                    } else {
                        var currentUsername = getUser[0].username;
                        user = { "token": jwtHelper.generateToken({ "username": currentUsername }), "message": "Loged !" };
                    }
                }
            }
            return cb(null, user);
        } catch (err) {
            console.log(err);
            cb(err);
        }
    }
));

passport.use(new GithubStrategy({
        clientID: keys.github.clientID,
        clientSecret: keys.github.clientSecret,
        callbackURL: keys.github.callbackURL
    },
    async function(accessToken, refreshToken, profile, cb) {
        try {
            var user = null;
            var email = null;
            const username = profile.username;
            const password = "Abcd1234";
            var cryptedPassword = cryptHelper.crypt(password);
            const firstname = "firstname";
            const lastname = "lastname";
            if (typeof profile.emails !== "undefined" && typeof profile.emails[0] !== "undefined") {
                email = profile.emails[0].value;
            } else {
                user = { "token": "", "message": "Email is not public !" };
                return cb(null, user);
            }
            const picture = "";
            const github = profile.id;
            const activationCode = uniqidHelper.generateUniqid();
            const activated = 1;

            var userCount = await userModel.getUserCountByGithubId(profile.id);
            if (userCount === false) {
                //console.log("login fail");
                user = { "token": "", "message": "Login fail !" };
            } else {
                if (userCount[0].COUNT === 0) {
                    //console.log("creating user ...");
                    var usernameCount = await registerModel.countUsername(username);
                    var emailCount = await registerModel.countEmail(email);
                    if (usernameCount === false || emailCount === false) {
                        //console.log("error");
                    } else if (usernameCount[0].COUNT === 0 && emailCount[0].COUNT === 0) {
                        var registerUserCheck = await registerModel.registerUserByOauth(firstname, lastname, username, cryptedPassword, email, picture, activationCode, activated, "", github, "", "");
                        if (registerUserCheck === false) {
                            //console.log("error .");
                        } else {
                            user = { "token": jwtHelper.generateToken({ "username": username }), "message": "Registered !" };
                        }
                    } else {
                        //console.log("email / username exists");
                        user = { "token": "", "message": "Registration fail !" };
                    }
                } else {
                    //console.log("login...");
                    var getUser = await userModel.getUserByGithubId(profile.id);
                    if (getUser === false) {
                        user = { "token": "", "message": "Login fail !" };
                    } else {
                        var currentUsername = getUser[0].username;
                        user = { "token": jwtHelper.generateToken({ "username": currentUsername }), "message": "Loged !" };
                    }
                }
            }
            return cb(null, user);
        } catch (err) {
            console.log(err);
            cb(err);
        }
    }
));

passport.use(new GitlabStrategy({
        clientID: keys.gitlab.clientID,
        clientSecret: keys.gitlab.clientSecret,
        callbackURL: keys.gitlab.callbackURL
    },
    async function(accessToken, refreshToken, profile, cb) {
        try {
            var user = null;
            var email = null;
            const username = profile.username;
            const password = "Abcd1234";
            var cryptedPassword = cryptHelper.crypt(password);
            const firstname = "firstname";
            const lastname = "lastname";
            if (typeof profile.emails !== "undefined" && typeof profile.emails[0] !== "undefined") {
                email = profile.emails[0].value;
            } else {
                user = { "token": "", "message": "Email is not public !" };
                return cb(null, user);
            }
            const picture = "";
            const gitlab = profile.id;
            const activationCode = uniqidHelper.generateUniqid();
            const activated = 1;
            var userCount = await userModel.getUserCountByGitlabId(profile.id);
            if (userCount === false) {
                //console.log("login fail");
                user = { "token": "", "message": "Login fail !" };
            } else {
                if (userCount[0].COUNT === 0) {
                    //console.log("creating user ...");
                    var usernameCount = await registerModel.countUsername(username);
                    var emailCount = await registerModel.countEmail(email);
                    if (usernameCount === false || emailCount === false) {
                        //console.log("error");
                    } else if (usernameCount[0].COUNT === 0 && emailCount[0].COUNT === 0) {
                        var registerUserCheck = await registerModel.registerUserByOauth(firstname, lastname, username, cryptedPassword, email, picture, activationCode, activated, "", "", gitlab, "");
                        if (registerUserCheck === false) {
                            //console.log("error .");
                        } else {
                            user = { "token": jwtHelper.generateToken({ "username": username }), "message": "Registered !" };
                        }
                    } else {
                        //console.log("email / username exists");
                        user = { "token": "", "message": "Registration fail !" };
                    }
                } else {
                    //console.log("login...");
                    var getUser = await userModel.getUserByGitlabId(profile.id);
                    if (getUser === false) {
                        user = { "token": "", "message": "Login fail !" };
                    } else {
                        var currentUsername = getUser[0].username;
                        user = { "token": jwtHelper.generateToken({ "username": currentUsername }), "message": "Loged !" };
                    }
                }
            }
            return cb(null, user);
        } catch (err) {
            console.log(err);
            cb(err);
        }
    }
));

passport.use(new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: keys.google.callbackURL
    },
    async function(accessToken, refreshToken, profile, cb) {
        try {
            var user = null;
            var email = null;
            const username = profile.name.givenName + profile.id;
            const password = "Abcd1234";
            var cryptedPassword = cryptHelper.crypt(password);
            const firstname = profile.name.givenName;
            const lastname = profile.name.familyName;
            if (typeof profile.emails !== "undefined" && typeof profile.emails[0] !== "undefined") {
                email = profile.emails[0].value;
            } else {
                user = { "token": "", "message": "Email is not public !" };
                return cb(null, user);
            }
            const picture = "";
            const google = profile.id;
            const activationCode = uniqidHelper.generateUniqid();
            const activated = 1;
            var userCount = await userModel.getUserCountByGoogleId(profile.id);
            if (userCount === false) {
                //console.log("login fail");
                user = { "token": "", "message": "Login fail !" };
            } else {
                if (userCount[0].COUNT === 0) {
                    //console.log("creating user ...");
                    var usernameCount = await registerModel.countUsername(username);
                    var emailCount = await registerModel.countEmail(email);
                    if (usernameCount === false || emailCount === false) {
                        //console.log("error");
                    } else if (usernameCount[0].COUNT === 0 && emailCount[0].COUNT === 0) {
                        var registerUserCheck = await registerModel.registerUserByOauth(firstname, lastname, username, cryptedPassword, email, picture, activationCode, activated, "", "", "", google);
                        if (registerUserCheck === false) {
                            //console.log("error .");
                        } else {
                            user = { "token": jwtHelper.generateToken({ "username": username }), "message": "Registered !" };
                        }
                    } else {
                        //console.log("email / username exists");
                        user = { "token": "", "message": "Registration fail !" };
                    }
                } else {
                    //console.log("login...");
                    var getUser = await userModel.getUserByGoogleId(profile.id);
                    if (getUser === false) {
                        user = { "token": "", "message": "Login fail !" };
                    } else {
                        var currentUsername = getUser[0].username;
                        user = { "token": jwtHelper.generateToken({ "username": currentUsername }), "message": "Loged !" };
                    }
                }
            }
            return cb(null, user);
        } catch (err) {
            console.log(err);
            cb(err);
        }
    }
));