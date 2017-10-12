var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var merchassocsSchema = new Schema({
  parentProdId: String,
  prodId: String,
  name: String,
  location: String,
  price: String,
  imageUrl: String,
  type: String
});

var MerchAssocs = mongoose.model('MerchAssocs', merchassocsSchema);

module.exports = MerchAssocs;