var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var rfidprodsSchema = new Schema({
  num: String,
  prodId : String
});

var RfidProds = mongoose.model('RfidProds', rfidprodsSchema);

module.exports = RfidProds;