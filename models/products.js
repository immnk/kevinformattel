var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productsSchema = new Schema({
  imageURL: String,
  identifier: String,
  catId: String,
  name: String,
  price: String,
  size: String,
  discountedPrice : String,
  parentCatId: String,
  type: String,
  available : String,
  location : String
});

var Products = mongoose.model('Products', productsSchema);

module.exports = Products;