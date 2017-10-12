var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var usernfcSchema = new Schema({
  nfcid: String,
  authtoken: String
});

var Usernfcid = mongoose.model('Usernfcid', usernfcSchema);

module.exports = Usernfcid;