var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userrfidSchema = new Schema({
  rfidArr: Array
});

var Userrfid = mongoose.model('Userrfid', userrfidSchema);

module.exports = Userrfid;