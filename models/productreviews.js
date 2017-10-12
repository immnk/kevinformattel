var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productReviewsSchema = new Schema({
  catId: String,
  reviews: Array
});

var ProductReviews = mongoose.model('ProductReviews', productReviewsSchema);

module.exports = ProductReviews;