/**
 * Created by Jeremy on 7/17/2017.
 */
module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        res.render('page');
    });

    app.get('/login', function (req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });

    app.get('/signup', function (req, res) {
        res.render('signup', { message: "stuff" });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/error', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // app.post('/login', function () {
    //
    // });

    // function isLoggedIn(req, res, next) {
    //
    //     // if user is authenticated in the session, carry on
    //     if (req.isAuthenticated())

    //         return next();
    //
    //     // if they aren't redirect them to the home page
    //     res.redirect('/error');
    // }
}