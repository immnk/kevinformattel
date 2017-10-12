'use strict';
var say = require('say');
var API_KEY='AIzaSyAp0EmHs1Czco37GbY-my4_M-27l0Js10Q';
var CSE_ID='009815226497428416255:5svy1uju2ky';
var u='http://2b5959cc.ngrok.io/AvnetLireServices/rest/AvnetLireServices/products?imageUrl=';
const ROOT_DIR = __dirname + '/'
const Sonus = require(ROOT_DIR + 'start.js')
const request = require('request');
global.searchResult=[];
var helper = require('./modules/helper');
var fx=require('money');
const speech = require('@google-cloud/speech')({
  projectId: 'streaming-speech-sample',
  keyFilename: ROOT_DIR + 'keyfile.json'
})

var express = require('express');
var bodyParser = require('body-parser');

//Routes
var productR = require(__dirname + '/routes/products')();
global.__base = __dirname + '/';
var websocket = require('./modules/socket');
var con = require('./modules/connection');
var connection = con.get();
var mongoose = require('mongoose');
var app = express();
app.set('port', (process.env.PORT || 8080));
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Process application/json
app.use(bodyParser.json());
app.use(express.static('WebContent'));

// Spin up the server for express js
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

// Index route
app.get('/', function(req, res) {
    res.sendFile(constants.HTML_DIR + 'chats.html', { root: __dirname });
});

// Index route
app.get('/sendWelcome', function(req, res) {
    var result='Hello. Welcome to Sirius Shop. I am here to help you. ';

    var textToSend1 = {
            type: 'welcome',
            data: ''
    }

     var textToSend2 = {
            type: 'text',
            data: result
      }
      connection = con.get();
      connection.send(JSON.stringify(textToSend1));
      connection.send(JSON.stringify(textToSend2));
      sayThis(result);
      res.sendStatus(200);
});


// Connect to database
var config = require('./config');
mongoose.connect(config.database.mlabs);
var constants = require('./modules/constants');



const hotwords = [{ file: ROOT_DIR + 'resources/Kevin.pmdl', hotword: 'Kevin' }]
const language = "en-US"

//recordProgram can also be 'arecord' which works much better on the Pi and low power devices
const sonus = Sonus.init({ hotwords, language, recordProgram: "rec" }, speech)

Sonus.start(sonus)
console.log('Say "' + hotwords[0].hotword + '"...')

sonus.on('hotword', function (index, keyword) {
  var textToSend2 = {
        type: 'text',
        data: 'Kevin is listening...'
  }
  connection = con.get();
  connection.send(JSON.stringify(textToSend2));
  console.log("Hotword detected" + keyword)
});

sonus.on('partial-result', function(result){
  var textToSend2 = {
        type: 'text',
        data: "Interpreted as : " + result
  }
  connection = con.get();
  connection.send(JSON.stringify(textToSend2));
  console.log("Partial", result);
});

const commands = {
  '(kevin) say hello to everyone': function () {
    var result='Hello! Welcome to Mattel. I am an artificially intelligent shopping assistant. I can help you find products, reviews and much more.';
        sayThis(result)

  },
  '(kevin) Hello everyone *text' : function(text){
    console.log("handled");
  },
  'so I can give you a personalized shopping experience! Say hello to the future' : function(text){
        console.log("handled");
  },
  '(kevin) Happy hacking *text' : function(text){
    console.log("handled");
  },
  'I was built by *text' : function(text){
    console.log("handled");
  },
   '*text I am an artificially intelligent *text' : function(text){
    console.log("handled");
  },
  '(kevin) hello': function () {
  	var result='Hello. I can help you with buying things at a store.';
    sayThis(result)

  },
  '(kevin) help': function () {
    var result='I can help you look for things for example you can ask me to look for a dress a celebrity wore';
    sayThis(result)

  },
    '(kevin) say thank you to everyone': function () {
    var result='Thank you for watching this video. If you want me to help out in your retail store or mobile app as a virtual assistant, please contact Mani, MeeSun, Sapna and Jan';
    sayThis(result)

  },
  '(kevin) help me': function () { 
    var result='I can help you look for things for example you can ask me to look for a dress a celebrity wore';
    sayThis(result)

  },
   '(kevin) How do I look': function () {
    var result='Dashing';
    sayThis(result)

  },
  '(kevin) Do I look good': function () {
    var result='You look stylish';
    sayThis(result)
  },
  '(kevin) Am I looking good': function () {
    var result='You look amazing';
    sayThis(result)
  },
  '(kevin) Is this good': function () {
    var result='I think so';
    sayThis(result)
  },
  '(kevin) do you think *test': function (test) {
    var result='I do not have an  opinion on that';
    sayThis(result)
  },
  '(kevin) Why should we use you': function () {
    var result='I can find information in seconds and I am also kinder than humans';
    sayThis(result)

  },
  '(kevin) (can you show me something) (show me something) (find me something) (do you have something) (i want something) (get me something) (something) (i want a dress) (i want a shirt) (i want a top) like *toBeSearched': function (toBeSearched) {
    var result='Showing you ' + toBeSearched;
    console.log(result);
    sayThis(result)
	  const GoogleImages = require('google-images');
	  const client = new GoogleImages(CSE_ID, API_KEY);
    connection = con.get();
    connection.send(JSON.stringify(helper.samples[0]));

	  client.search(toBeSearched).then(function(res){
      global.searchResult=res;
  		console.log(res);
      connection = con.get();
      connection.send(JSON.stringify(helper.samples[0]));
      var textToSend = helper.samples[7];
      textToSend.data = res;

      if (connection) {
          connection.send(JSON.stringify(textToSend));
      }
		});
  },
  '(kevin) (can you) Tell me about this': function () {
    var result='Showing you the available sizes';

    getReviews('416290').then(function(response) {
        console.log("You dont lose because of your ability! You lose because of what you miss to do! Go full on !! #TeamWTF");
        console.log("Sap response :" + response.product);
        console.log("Sap response :" + response.reviews);

        var textToSend = {
            type: 'text',
            data: constants.PDP
        }

        var toSend = {
            type: 'pdp',
            data: response
        }
        connection = con.get();
        
        if (connection) {
            connection.send(JSON.stringify(textToSend));
            sayThis(constants.PDP)

            connection.send(JSON.stringify(toSend));
            
            //say.stop();
            // sayThis('Item is not available! Tap to connect and get the product delivered');
            // connection.send(JSON.stringify('Item is not available! Tap to connect and get the product delivered'));
        }

    }, function(err) {
        console.log(err);
    });

    

  },
  '(kevin) (do you have the) (show me the) (can you find the) next size': function () {
    var result='Showing you the available sizes';

    getNextSize('416261','next size').then(function(response) {
        console.log("You dont lose because of your ability! You lose because of what you miss to do! Go full on !! #TeamWTF");
        console.log("Sap response :" + response.product);
        console.log("Sap response :" + response.reviews);

        var textToSend = {
            type: 'text',
            data: constants.GETTING_SIZES
        }

        var toSend = {
            type: 'pdp',
            data: response
        }
        connection = con.get();
        
        if (connection) {
            connection.send(JSON.stringify(textToSend));
            sayThis(constants.GETTING_SIZES)

            connection.send(JSON.stringify(toSend));
            
            //say.stop();
            // sayThis('Item is not available! Tap to connect and get the product delivered');
            // connection.send(JSON.stringify('Item is not available! Tap to connect and get the product delivered'));
        }

    }, function(err) {
        console.log(err);
    });

    

  },
   '(kevin) (I want to buy something) (I want to buy a gift) (suggest a gift) (show me something) for my niece :name': function (name) {
    var result='Showing recommendations for your niece '+name;
    console.log(result)
    connection = con.get();
    connection.send(JSON.stringify(helper.samples[0]));
    getRecommendation("toys").then(function(response) {
        var textToSend = {
            type: 'pdpgrid',
            data: response
        }
         var textToS = {
            type: 'text',
            data: result
        }
        connection = con.get();
        if (connection) {
            connection.send(JSON.stringify(textToSend));
            connection.send(JSON.stringify(textToS));
            sayThis(result)
        }
    }, function(error) {
        console.error(error);
    })
    

  },

   '(kevin) (Show me some) (Show me) accessories': function () {
    var result='You can pair with these';

    connection = con.get();
    connection.send(JSON.stringify(helper.samples[0]));
    getMerchAssoc('416400').then(function(response) {
        var textToSend = {
            type: 'upsale',
            data: response
        }
        var textToS = {
            type: 'text',
            data: result
        }
        if (connection) {
            connection.send(JSON.stringify(textToSend));
             connection.send(JSON.stringify(result));

            sayThis(result)
        }
    }, function(err) {
        console.error(err);
    });
    

  },
   '(kevin) (What can I pair with my) (What can I pair with this) outfit': function () {
    var result='Showing  recommendations for your outfit';
    console.log(result)
      connection = con.get();
    connection.send(JSON.stringify(helper.samples[0]));
    getMerchAssoc('416400').then(function(response) {
        var textToSend = {
            type: 'upsale',
            data: response
        }
        var textToS = {
            type: 'text',
            data: result
        }
        if (connection) {
            connection.send(JSON.stringify(textToSend));
             connection.send(JSON.stringify(result));

            sayThis(result)
        }
    }, function(err) {
        console.error(err);
    });
    sayThis(result)

  },
   '(kevin) Show me reviews': function () {
    var result='Showing  reviews';
    console.log(result)
    //sayThis(constants.GETTING_REVIEWS)
    getReviews('416298').then(function(response) {
        console.log("You dont lose because of your ability! You lose because of what you miss to do! Go full on !! #TeamWTF");
        console.log("Sap response :" + response.product);
        console.log("Sap response :" + response.reviews);

        var textToSend = {
            type: 'text',
            data: constants.GETTING_REVIEWS
        }

        var toSend = {
            type: 'pdp',
            data: response
        }
        connection = con.get();
        console.log(connection);
        if (connection) {
            connection.send(JSON.stringify(textToSend));
            sayThis(constants.GETTING_REVIEWS)
            connection.send(JSON.stringify(toSend));
        }

    }, function(err) {
        console.log(err);
    });

  },

  '(kevin) (I want to) (I wanna) (Help me) (I will) buy': function () {
    var result='Added to cart!';
    console.log(result)
    sayThis(result)

  },

  '(kevin) (I want to) (I wanna) (Help me) (I will) buy this online': function () {
    var result='Added to cart! You can pay and place the order from our website.';
    console.log(result)
    sayThis(result)

  },
    '(kevin) (This is too) (This is way too) (Way too) expensive': function () {
    var result='Filtering price';
      connection = con.get();
      if(connection){
        connection.send(JSON.stringify(helper.samples[0]));
      }
    filterPrice('416400').then(function(response) {
        var textToSend = {
            type: 'upsale',
            data: response
        }
        var textToS = {
            type: 'text',
            data: result
        }
        if (connection) {
            connection.send(JSON.stringify(textToSend));
             connection.send(JSON.stringify(result));

            sayThis(result)
        }
    }, function(err) {
        console.error(err);
    });
    console.log(result)
    // sayThis(result)
		
  },
   '(kevin) (I want a) (help me find a) girlfriend': function () {
    var result='I dont do uncle job';
    console.log(result)
   sayThis(result)
  },
   '(kevin) (Can you) convert price to :currency': function (currency) {
    var result='Price in';
    console.log(result)

    global.currencyToPass = currency;

    request('http://api.fixer.io/latest', function (error, response, body) {

      //data=JSON.parse(body);
      var toCode=constants.CURRENCY[global.currencyToPass];
      fx.rates = JSON.parse(body).rates;
      var rate = fx(global.totalPrice).from("USD").to(toCode);
      console.log(toCode);
      connection = con.get();
      var textToSend = {
            type: 'text',
            data: rate.toFixed(1) + ' ' + currencyToPass
      }
      if (connection) {
            connection.send(JSON.stringify(textToSend));
            sayThis(rate.toFixed(1) + ' ' + currencyToPass)
        }
        
    });
  },
  '(kevin) (show me the) (find) price for this': function () {
    var result='Fetching current price';
    console.log(result)

    connection = con.get();
    connection.send(JSON.stringify(helper.samples[0]));

    getPriceForProduct().then(function(response) {
        var textToSend = helper.samples[6];
        textToSend.data = response;

        var textToS = {
            type: 'text',
            data: result
        }
        if (connection) {
            connection.send(JSON.stringify(textToSend));
            sayThis(result)
            connection.send(JSON.stringify(textToS));

        }
    }, function(error) {
        console.error(error);
    });


    //sayThis(result)
  },
    '(kevin) how much does this cost': function () {
    var result='Fetching current price';
    console.log(result)

    connection = con.get();
    connection.send(JSON.stringify(helper.samples[0]));

    getPriceForProduct().then(function(response) {
        var textToSend = helper.samples[6];
        textToSend.data = response;

        var textToS = {
            type: 'text',
            data: result
        }
        if (connection) {
            connection.send(JSON.stringify(textToSend));
            sayThis(result)
            connection.send(JSON.stringify(textToS));

        }
    }, function(error) {
        console.error(error);
    });


    //sayThis(result)
  },
  '(kevin) (get) (find) total price': function () {
    var result='Your bill amount is ';
    console.log(result)

    connection = con.get();
    connection.send(JSON.stringify(helper.samples[0]));
    getTotalPrice().then(function(response) {
        var textToS = {
            type: 'text',
            data: result + response.totalPrice
        }
        connection = con.get();
        connection.send(JSON.stringify(helper.samples[0]));
        var textToSend = helper.samples[8];
        textToSend.data = response;

        if (connection) {

            connection.send(JSON.stringify(textToSend));

            connection.send(JSON.stringify(textToS));

            global.totalPrice = parseInt(response.totalPrice);
            sayThis(result + response.totalPrice)
        }
    }, function(error) {

    });

    //totalPrice - set as global variable
  },
   '(kevin) what is the total bill amount': function () {
    var result='Your bill amount is ';
    console.log(result)

    connection = con.get();
    connection.send(JSON.stringify(helper.samples[0]));
    getTotalPrice().then(function(response) {
        var textToS = {
            type: 'text',
            data: result + response.totalPrice
        }
        connection = con.get();
        connection.send(JSON.stringify(helper.samples[0]));
        var textToSend = helper.samples[8];
        textToSend.data = response;

        if (connection) {

            connection.send(JSON.stringify(textToSend));

            connection.send(JSON.stringify(textToS));

            global.totalPrice = parseInt(response.totalPrice);
            sayThis(result + response.totalPrice)
        }
    }, function(error) {

    });

    //totalPrice - set as global variable
  },
  '(kevin) (show me the) first one':function (){
        var requestURL=u+global.searchResult[0].url;
        console.log(requestURL)
        callVisualSearch(requestURL)

  },
    '(kevin) (show me the) second one':function (){

        var requestURL=u+global.searchResult[1].url;
        callVisualSearch(requestURL)
  },
   '(kevin) (show me the) third one':function (){

        var requestURL=u+global.searchResult[2].url;
        callVisualSearch(requestURL)

  },
  '(kevin) (show me the) fourth one':function (){

        var requestURL=u+global.searchResult[3].url;
        callVisualSearch(requestURL)
 
  },
   '(kevin) (show me the) fifth one':function (){

        var requestURL=u+global.searchResult[4].url;
        callVisualSearch(requestURL)

  },
  '(kevin) (show me the) sixth one':function (){

        var requestURL=u+global.searchResult[5].url;
        callVisualSearch(requestURL)

  },
  '(kevin) (show me the) seventh one':function (){

        var requestURL=u+global.searchResult[6].url;
        callVisualSearch(requestURL)

  },
  '(kevin) (show me the) eighth one':function (){

        var requestURL=u+global.searchResult[7].url;
        callVisualSearch(requestURL)

  },
  '(kevin) (show me the) nineth one':function (){

        var requestURL=u+global.searchResult[8].url;
        callVisualSearch(requestURL)

  },
  '(kevin) (show me the) tenth one':function (){

        var requestURL=u+global.searchResult[9].url;
        callVisualSearch(requestURL)

  },
    '(kevin) can you convert this to *currency': function (currency) {
    var result='Price in';
    console.log(result)

    global.currencyToPass = currency;
    global.totalPrice = global.totalPrice;

    request('http://api.fixer.io/latest', function (error, response, body) {

      //data=JSON.parse(body);
      var toCode=constants.CURRENCY[global.currencyToPass];
      fx.rates = JSON.parse(body).rates;
      var rate = fx(global.totalPrice).from("USD").to(toCode);
      console.log(toCode);
      connection = con.get();
      var textToSend = {
            type: 'text',
            data: rate.toFixed(1) + ' ' + currencyToPass
      }
      if (connection) {
            connection.send(JSON.stringify(textToSend));
            sayThis(rate.toFixed(1) + ' ' + currencyToPass)
        }
        
    });
  },
}

 Sonus.annyang.addCallback('resultNoMatch', function(userSaid, commandText, phrases) {
    console.log('here');
     var result='Sorry I could  not understand that';
     sayThis(result);
  });

sonus.on('final-result', result => {
  Sonus.annyang.removeCommands();

	Sonus.annyang.addCommands(commands);
   var textToSend2 = {
        type: 'text',
        data: "Kevin heard it as : " + result 
  }
  connection = con.get();
  connection.send(JSON.stringify(textToSend2));
  console.log("Final detection", result)

  if (result.includes("stop")) {
    Sonus.stop()
  }
})

function sayThis(result){
  console.log(result);
	 say.speak( result, 'Tom', 1.0, function(err) {
  			if (err) {
  				   console.log(err);
			  }
			  console.log("done");
		});
}

function callVisualSearch(requestURL){
  connection = con.get();
  connection.send(JSON.stringify(helper.samples[0]));

  request({
            url: requestURL,
            async:false
        }, function (error, response, body){
            console.log(body); 
            parseResponse(body)
          });   
}

function parseResponse(body){
console.log(body)

console.log(typeof body)
var object= JSON.parse(body);
console.log(typeof object)

var grid=[];
for(var i=0;i<object.productArray.length;i++){
  var result=object.productArray[i];
  var gridItem={};
  gridItem.imageURL=result.url;
  gridItem.identifier= "";
  gridItem.name= result.name;
  gridItem.price= result.price;
  gridItem.location = "First Floor";
  grid.push(gridItem);

  }
  var textToSend = {
            type: 'text',
            data: constants.SHOWING_RESULTS
        }
  var toSend = {
            type: 'pdpgrid',
            data: grid
        }
        connection = con.get();
        console.log(connection);
        if (connection) {
            connection.send(JSON.stringify(textToSend));
            sayThis(constants.SHOWING_RESULTS)
            connection.send(JSON.stringify(toSend));
        }
        console.log(grid);
}

