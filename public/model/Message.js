/**
 * Created by Jeremy on 7/17/2017.
 */
var mongoose = require('mongoose'), Schema = mongoose.Schema;

var messageSchema = Schema({
    _user : {type: Number, ref: 'User'},
    body : String,
    date_sent : String
});

var Message = mongoose.model('Message', messageSchema);