/**
 * Created by Jeremy on 7/7/2017.
 */
var userModel = require('../public/model/User');
var messageModel = require('../public/model/Message');


var fs = require('fs');
var https = require('https');

var express = require("express");
var app = express();
// app.use(express.static('config'));

var mongoose = require('mongoose');

var passport = require('passport');

var flash = require('connect-flash');

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var session = require('express-session');

var dbConfig = require('../config/databaseConfig.js');

require('../config/passportConfig')(passport);

var options = {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/cert.pem')
};

var port = 8443;

var chatLog = [];

var server = https.createServer(options,app);
var io = require('socket.io')(server);

mongoose.connect(dbConfig.url);


app.set('views','views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.use(express.static('public'));


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

// app.get("/", function(req, res){
//     res.render("page");
// });
//
// app.get("/login",function (req, res) {
//     res.render("login");
// });


app.get("/getJson", function (req, res) {
    mongoose.connect('mongodb://localhost:27017/rtchat');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console,'connection error: '));
    db.once('open',function () {
        var cursor = db.collection('chat').find({}).toArray(function(err, result){
            chatLog = result;
            res.json(chatLog);
        });
    });
});

app.get("/error", function (req,res) {
    res.render('error')
});

io.on('connection', function (socket) {
    socket.on('send', function (data) {
        data.message = data.message.replace(/[>]/g, '&gt');
        data.message = data.message.replace(/[<]/g, '&lt');
        console.log(data);
        io.sockets.emit('message', data);
        writeMessage(data);
        writeChatLog();
    });

    socket.on('disconnect', function () {
        // writeChatLog();
    });
});

require('../routes/routes')(app,passport);

server.listen(port, function () {
    // console.log('server up and running at %s port', serverPort);
});

function writeChatLog(){
    mongoose.connect('mongodb://localhost:27017/rtchat', function (err, db) {
        if (err) throw err;
        db.collection('chat').deleteMany({},function () {
            if(chatLog.length > 0){
                db.collection('chat').insertMany(chatLog, function (err, result) {
                    console.log(err);
                    db.close();
                });
            }
        });
    } );
}

function writeMessage(data){
    var make = {};
    make.username = data.user;
    make.message = data.message;
    chatLog.push(make);
    console.log(chatLog);
}
