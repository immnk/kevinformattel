var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  userId: String,
  age: String,
  gender: String,
  auth: String,
  rfid:String
});

var User = mongoose.model('User', userSchema);

module.exports = User;