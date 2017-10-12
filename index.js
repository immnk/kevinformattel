var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// websocket and http servers
// var webSocketServer = require('websocket').server;
// var http = require('http');

var config = require('./config');
var constants = require('./modules/constants');
var websocket = require('./modules/socket');
var con = require('./modules/connection');
var helper = require('./modules/helper');
var hw = require('./routes/hw_route')();

var app = express();
global.__base = __dirname + '/';


//Imports
var products = require(__base + 'models/products');


//Routes
var productR = require(__dirname + '/routes/products')();


app.set('port', (process.env.PORT || 8080));
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Process application/json
app.use(bodyParser.json());
app.use('/hw', hw);
app.use(express.static('WebContent'));

// Spin up the server for express js
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

// Connect to database
mongoose.connect(config.database.mlabs);

var connection = con.get();
// Index route
app.get('/', function(req, res) {
    res.sendFile(constants.HTML_DIR + 'chats.html', { root: __dirname });
});



// Index route
app.get('/getSomething', function(req, res) {
    //var resp = getNextSizeNew('416261','next size');
    //console.log('getNextSize'+getNextSize('416261','L'));
    //getReviews('416290');
    // getMerchAssoc('416400').then(function(response){
    //         console.log("You dont lose because of your ability! You lose because of what you miss to do! Go full on !! #TeamWTF");
    //         console.log("Sap response :"+response.upSale);
    //         console.log("Sap response :"+response.crossSale);
    // }, function(err) {
    //     console.log(err);
    // });
    getReviews('416290').then(function(response) {
        console.log("You dont lose because of your ability! You lose because of what you miss to do! Go full on !! #TeamWTF");
        console.log("Sap response :" + response.product);
        console.log("Sap response :" + response.reviews);
    }, function(err) {
        console.log(err);
    });
    res.sendStatus(200);


});


app.get('/sendGrid', function(req, res) {
    connection = con.get();
    connection.send(JSON.stringify(helper.samples[0]));
    getRecommendation("book").then(function(response) {
        var textToSend = {
            type: 'pdpgrid',
            data: response
        }
        connection = con.get();
        if (connection) {
            connection.send(JSON.stringify(textToSend));
        }
    }, function(error) {
        console.error(error);
    })
    res.sendStatus(200);
});

app.get('/sendSales', function(req, res) {
    connection = con.get();
    connection.send(JSON.stringify(helper.samples[0]));
    getMerchAssoc('416400').then(function(response) {
        var textToSend = {
            type: 'upsale',
            data: response
        }
        if (connection) {
            connection.send(JSON.stringify(textToSend));
        }
    }, function(err) {
        console.error(err);
    });

    res.sendStatus(200);
});

app.get('/sendPDP', function(req, res) {
    connection = con.get();
    connection.send(JSON.stringify(helper.samples[0]));
    getReviews('416290').then(function(response) {
        console.log("You dont lose because of your ability! You lose because of what you miss to do! Go full on !! #TeamWTF");
        console.log("Sap response :" + response.product);
        console.log("Sap response :" + response.reviews);
        var toSend = {
            type: 'pdp',
            data: response
        }
        if (connection) {
            connection.send(JSON.stringify(toSend));
        }

    }, function(err) {
        console.log(err);
    });

    res.sendStatus(200);

});

app.get('/sendDiscount', function(req, res) {
    connection = con.get();
    connection.send(JSON.stringify(helper.samples[0]));
    getPriceForProduct().then(function(response) {
        var textToSend = helper.samples[6];
        textToSend.data = response;

        if (connection) {
            connection.send(JSON.stringify(textToSend));
        }
    }, function(error) {
        console.error(error);
    });

    res.sendStatus(200);
});

app.get('/sendSearch', function(req, res) {
    connection = con.get();
    connection.send(JSON.stringify(helper.samples[0]));
    var textToSend = helper.samples[7];
    textToSend.data = [{
        type: 'image/jpeg',
        width: 634,
        height: 981,
        size: 138679,
        url: 'http://i.dailymail.co.uk/i/pix/2013/08/15/article-0-1B4F5904000005DC-92_634x981.jpg',
        thumbnail: {
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBBEoyURGk5EzBUNCE1EHlzD3O8lZQuFMvOaE0ERkLxcQhgdXjJ_ZhB4w',
            width: 96,
            height: 149
        },
        description: 'Angelina Jolie leaves London with son Maddox after almost run-in ...',
        parentPage: 'http://www.dailymail.co.uk/tvshowbiz/article-2394550/Angelina-Jolie-leaves-London-son-Maddox-run-Jennifer-Aniston.html'
    }, {
        type: 'image/jpeg',
        width: 634,
        height: 981,
        size: 138679,
        url: 'http://i.dailymail.co.uk/i/pix/2013/08/15/article-0-1B4F5904000005DC-92_634x981.jpg',
        thumbnail: {
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBBEoyURGk5EzBUNCE1EHlzD3O8lZQuFMvOaE0ERkLxcQhgdXjJ_ZhB4w',
            width: 96,
            height: 149
        },
        description: 'Angelina Jolie leaves London with son Maddox after almost run-in ...',
        parentPage: 'http://www.dailymail.co.uk/tvshowbiz/article-2394550/Angelina-Jolie-leaves-London-son-Maddox-run-Jennifer-Aniston.html'
    }];

    if (connection) {
        connection.send(JSON.stringify(textToSend));
    }

    res.sendStatus(200);
});

app.get('/sendBill', function(req, res) {
    connection = con.get();
    connection.send(JSON.stringify(helper.samples[0]));
    getTotalPrice().then(function(response) {
        connection = con.get();
        connection.send(JSON.stringify(helper.samples[0]));
        var textToSend = helper.samples[8];
        textToSend.data = response;

        if (connection) {
            connection.send(JSON.stringify(textToSend));
        }
    }, function(error) {

    });


    res.sendStatus(200);
});
