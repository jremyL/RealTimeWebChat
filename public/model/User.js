/**
 * Created by Jeremy on 7/17/2017.
 */
var mongoose = require('mongoose'), Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    first_name : String,
    last_name : String,
    username : String,
    email : String,
    password : String,
    user_icon : String,
    messages : [{type: Schema.Types.ObjectId, ref: 'Message'}]
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8), null)
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model('User', userSchema);