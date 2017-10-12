var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');
var request = require('request');
var shortid = require('shortid');
var constants = require('./constants');
function saveInDb(res)
	{
		console.log("saveInDb hit");
	}

module.exports = {

	
	getVisualData:function(path,resp){
		console.log('getData hit');
		console.log(path);
		var visual_recognition = new VisualRecognitionV3({
		  api_key: '91c91c737bbdf78912a5bed36f7bcc00128cfcb0',
		  version_date: VisualRecognitionV3.VERSION_DATE_2016_05_20
		});
		request(path).pipe(fs.createWriteStream('img.jpg')).on('close', function(){

			var params = {
			  images_file: fs.createReadStream('img.jpg')
			};
			 
			visual_recognition.detectFaces(params, function(err, res) {
			  if (err)
			    console.log(err);
			  else
			    console.log(JSON.stringify(res, null, 2));
				saveInDb(res);
				resp.sendStatus(200);
			});
		});
		 
		
	},
	getUserTokenFromPi:function(req,res){
		request('path', function (error, response, body) {
	    var nfccode=response.code;
	    saveInDB();
		});
	},
	putUser:function(req,res){
		var user = require(__base + 'models/user');
                    var userSchema = new user({
                        userId: req.query.userId
                    });
                    userSchema.save(function(err) {
                        if (err) next(err);

                        console.log('user persisted in db!');
                    });
	},

	createUser:function(req,res){
		var usersId=shortid.generate();
		console.log(usersId);
		var user = require(__base + 'models/user');
		var userSchema = new user({
                        userId: usersId
                    });
                    userSchema.save(function(err) {
                        if (err) next(err);

                        console.log('userrfid persisted in db!');
                        res.sendStatus(200);
                    });


	},
	getPic:function(req,res)
	{
		request(req.query.path).pipe(fs.createWriteStream('img.jpg')).on('close', function(){

			var params = {
			  images_file: fs.createReadStream('img.jpg')
			};
			 
			visual_recognition.detectFaces(params, function(err, res) {
			  if (err)
			    console.log(err);
			  else
			    console.log(JSON.stringify(res, null, 2));
				saveInDb(res);
				resp.sendStatus(200);
			});
		});
	},
	getRfid:function(req,res)
	{
		request('http://8eee5f51.ngrok.io/getRfid', function (error, response, body) {
			var sample = body;
		    console.log(JSON.parse(sample).rfidcode);
		    var code=JSON.parse(sample).rfidcode;
		    var userrfid = require(__base + 'models/userrfid');
	                    var userrfidSchema = new userrfid();
	                    userrfid.update({}, function(err) {
	                    	if (err) next(err);

	                    	console.log('userrfid persisted in db!');
	                    });
	                    res.send(code);
		});
	},
	getNfc:function(req,res)
	{
		request('http://8eee5f51.ngrok.io/getNFC', function (error, response, body) {
			var sample = body;
		    
		    var code=JSON.parse(sample).nfcid;
		    console.log(code);
		    var usernfc = require(__base + 'models/usernfc');
	                    
	                    usernfc.find({"nfcid":code}, function(err,doc) {
	                    	if (err) next(err);
	                    	console.log(doc[0].authtoken);
	                    	res.send(doc[0].authtoken);
	                    });
	                    
		});
	}
	


	
}
	




