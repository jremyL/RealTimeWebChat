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

}