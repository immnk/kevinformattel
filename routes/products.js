	var express = require('express');
	var request = require('request');
	var router = express.Router();
	var q = require('q');


	module.exports = function() {

		router.get('/', function(req, res) {
			res.send('Option Home');
		});

		// Getting next size - request ( next size ) or L,XL
		this.getNextSize = function(catId,nextSize) { 

				var deferred = q.defer();


				var prod = require(__base + 'models/products');

				var nextSizeString = nextSize.toLocaleLowerCase();
				if(nextSizeString.includes('next size')){
					console.log(nextSizeString);
					console.log(catId);
					var nextCatId = parseInt(catId)+ 1;
					console.log(nextCatId);
					prod.find({'catId':nextCatId}, function(err, doc) {
			            if (err) next(err);
			            var finalResp = {};
			            finalResp.product = doc;
			            deferred.resolve(finalResp);
			            console.log(doc);
			            
			        });

				}
				else{
					console.log(catId);
					prod.find({'catId':catId}, function(err, doc) {
						//console.log(doc);
			            var parentCatId = doc[0].parentCatId;
			            console.log(parentCatId);

			            prod.find({"parentCatId":parentCatId}, function(err, doc) {

			            	for(var i = 0; i < doc.length ; i++){
			            		if(typeof(doc[i].size) == 'undefined')
									doc[i].size = '';
								var itemCatSize = doc[i].size.toLocaleLowerCase();
								if(nextSizeString.includes(itemCatSize)){
									console.log(doc[i]);
										var finalResp = {};
			            				finalResp.product = doc[i];
									
									deferred.resolve(finalResp);
										
								}
			            	}
			            	
						});
			            
			        });

					
				}

				return deferred.promise;
		};


		// Get Reviews

		this.getReviews= function(catId) { 

				var deferred = q.defer();
				var prod = require(__base + 'models/productreviews');
				var p = require(__base + 'models/products');
				console.log(catId);
				var prod1 = p.collection.find({"catId":catId});
					global.finalProd = {};


					p.find({"catId":catId}, function(err, doc1) {
						if(err) {
							console.log(err);
							deferred.reject(err);
						}
						console.log(doc1);
						global.finalProd.product = doc1;
						prod.find({"catId":catId}, function(err, doc2) {
				 			console.log(doc2);
				 			global.finalProd.reviews=doc2;
				 			deferred.resolve(global.finalProd);

				 		});

				 	});

				return deferred.promise;
				
		};


		//Get recommendations from FB

		this.getRecommendation= function(likesType) { 

				var deferred = q.defer();
				var prod = require(__base + 'models/products');
				console.log(likesType);
				 prod.find({"type":likesType}, function(err, doc) {
				 	console.log(doc);
				 	deferred.resolve(doc);

				 });
				 	return deferred.promise;
					
				};


		//Get merchandising associations from FB

		this.getMerchAssoc= function(catId) { 

				var deferred = q.defer();
				var prod = require(__base + 'models/merchassocs');
				var p = require(__base + 'models/products');
				
				p.find({"catId":catId}, function(err, doc1) {

					global.productInfo = doc1;
					prod.find({"parentProdId":catId}, function(err, doc) {
					 	//console.log(doc);
					 	var finalArr = {};
					 	var upSaleArr = [];
					 	var crossSaleArr = [];

					 	for(var k = 0; k<doc.length;k++){
					 		if(doc[k].type.includes('upsale'))
					 			upSaleArr.push(doc[k]);
					 		if(doc[k].type.includes('crosssale'))
					 			crossSaleArr.push(doc[k]);	
					 	}
					 	finalArr.upSale = upSaleArr;
					 	finalArr.crossSale = crossSaleArr;
					 	var finalResp = {};
					 	finalResp.productInfo = global.productInfo;
					 	finalResp.saleInfo = finalArr;
					 	
					 	deferred.resolve(finalResp);

					 });
				});
				 	return deferred.promise;
					
				};



		



		//Find the price for the rfid
		this.getPriceForProduct = function(){
			var deferred = q.defer();
			var prod = require(__base + 'models/products');
			var urfid = require(__base + 'models/userrfid');
			var rfidPRod = require(__base + 'models/rfidprods');

			urfid.find({}, function(err, doc1) {
				
				var rfid = doc1[0].rfidArr[0];
				rfidPRod.find({'num':rfid}, function(err, doc2) {
					var prodId = doc2[0].prodId;
					console.log(prodId);
					prod.find({'catId':prodId}, function(err, doc3) {
						var finalResp = {};
						finalResp.name = doc3[0].name;
						finalResp.imageURL = doc3[0].imageURL;
						finalResp.price = doc3[0].price;
						finalResp.discountedPrice = doc3[0].discountedPrice;
						console.log(finalResp);
						deferred.resolve(finalResp);
					});

				});


			});

			return deferred.promise;
				
		};


		//Find the total Price
		this.getTotalPrice = function(){
			var deferred = q.defer();
			var prod = require(__base + 'models/products');
			var urfid = require(__base + 'models/userrfid');
			var rfidPRod = require(__base + 'models/rfidprods');
			global.count = 0;
			global.productData = [];
			global.totalPrice = 0;
			urfid.find({}, function(err, doc1) {
				//console.log(doc1[0].rfidArr);
				
				rfidPRod.find({'num': {$in: doc1[0].rfidArr}}, function(err, doc2) {
					var productIds = [];
					for(var j = 0 ; j < doc2.length ; j++) {
						productIds.push(doc2[j].prodId)
					}

					
						//console.log(doc2[j]);
						global.count = global.count + 1;
						console.log(productIds);

						prod.find({'catId': {$in: productIds}}, function(err, doc3) {
							console.log(doc3[0]);
							for(var k = 0 ; k < doc3.length ; k++) {
								var finalResp = {};
								finalResp.name = doc3[k].name;
								finalResp.price = doc3[k].price;
								finalResp.catId = doc3[k].catId;
								finalResp.size = doc3[k].size;
								finalResp.price = doc3[k].price;
								finalResp.imageURL = doc3[k].imageURL;
								global.totalPrice = global.totalPrice + parseInt(doc3[k].price);
								global.productData.push(finalResp);
							}
							
								var finalResp1 = {};
								finalResp1.productData = global.productData;
								finalResp1.totalPrice = global.totalPrice;
								console.log(finalResp1);
								deferred.resolve(finalResp1);
							});
							
						});

					
					
				});


		

			return deferred.promise;
				
		};
		

			//Find the price for the rfid
		this.filterPrice = function(catId){
			    console.log(catId)
				var deferred = q.defer();
				var prod = require(__base + 'models/merchassocs');
				var p = require(__base + 'models/products');
				
				p.find({"catId":catId}, function(err, doc1) {

					global.productInfo = doc1;
					prod.find({"price": { "$lt": "30" }},function(err,doc) {
					 	var finalArr = {};
					 	var upSaleArr = [];
					 	var crossSaleArr = [];
					 	console.log(catId);
                        console.log(doc);
					 	for(var k = 0; k<doc.length;k++){
					 		if(doc[k].type.includes('upsale'))
					 			upSaleArr.push(doc[k]);
					 		if(doc[k].type.includes('crosssale'))
					 			crossSaleArr.push(doc[k]);	
					 	}
					 	finalArr.upSale = upSaleArr;
					 	finalArr.crossSale = crossSaleArr;
					 	var finalResp = {};
					 	finalResp.productInfo = global.productInfo;
					 	finalResp.saleInfo = finalArr;
					 	
					 	deferred.resolve(finalResp);

					 });
				});
				 	return deferred.promise;
				
		};


		return router;

	}