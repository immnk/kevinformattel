var express = require('express');
var request = require('request');
var router = express.Router();
var visrec_mod=require('../modules/hw_mod');



module.exports = function() {

	router.get('/getVisualDetails', function(req, res) {
		console.log(req.query.file);
		visrec_mod.getVisualData(req.query.file,res);
	});

	router.get('/getUserToken', function(req, res) {
		visrec_mod.getUserTokenFromPi(req,res);
	});
	router.get('/putUser', function(req, res) {
		visrec_mod.putUser(req,res);
	});
	router.get('/createUser', function(req, res) {
		visrec_mod.createUser(req,res);
	});
	router.get('/getPic',function(req,res)
	{
		visrec_mod.getPic(req,res);
	});
	router.get('/getRfid',function(req,res)
	{
		visrec_mod.getRfid(req,res);
	});
	router.get('/getNfc',function(req,res)
	{
		visrec_mod.getNfc(req,res);
	});
	router.get('/convertCurrency',function(req,res){
		visrec_mod.convertCurrency(req,res);
	});

	return router;
}