const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const md5 = require('md5');

module.exports = {
    config(app) {
        passport.use(new LocalStrategy(async (username, password, done) => {
            const user = await User.get(username);
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            const md5Pwd = md5(password);
            if (md5Pwd !== user.password) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);
        }));

        passport.serializeUser((user, done) => {
            done(null, user.name);
        });

        passport.deserializeUser(async (name, done) => {
            const user = await User.get(name);
            done(null, user);
        });
        passport.authenticationMiddleware = function () {
            return function (req, res, next) {
                if (req.isAuthenticated()) {
                    return next();
                }
                res.status(401).send('Unauthorized');
            }
        };
        app.use(passport.initialize());
        app.use(passport.session());
    }
}