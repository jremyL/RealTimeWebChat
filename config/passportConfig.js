/**
 * Created by Jeremy on 7/17/2017.
 */
var LocalStrat = require('passport-local').Strategy;

var User = require('../public/model/User');

module.exports = function (passport) {
    passport.serializeUser(function (user,done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrat({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, 
        function (req, email, password, done ) {
            process.nextTick(function () {
                User.findOne({'email' : email}, function (err, user) {
                    if(err)
                        return done(err);
                    if(user){
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        var newUser = new User();
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.first_name = req.body.firstName;
                        newUser.last_name = req.body.lastName;
                        newUser.username = req.body.username;

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                })
            })
        }
    ));

    passport.use('local-login', new LocalStrat({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);
            });

        }));

}