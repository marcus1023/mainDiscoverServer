#!/usr/bin/env nodejs
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = module.exports = express();
var router = express.Router();
var stripeCaos = require("stripe")("sk_test_WKr3frBetxtWT1MrMzBNBtrs");
var stripeDiscoverCS = require("stripe")("sk_live_3LW49Obp1hucuVPWgIm87HmM");
const nodemailer = require('nodemailer');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors())

app.use(session({
	secret: "thidsdszdkfjskljdislkjsdfius777the8ewr938SSSec23",
	resave: true,
	saveUninitialized: false,
	cookie: {
		maxAge:(1000*60*60*24*7)
	}
}));

app.post('/api/apetest', function(req, res) {
	console.log(req.body)
	var token = req.body.token;
	var amount = req.body.amount;

	var charge = stripeCaos.charges.create({
  amount: amount,
  currency: "aud",
  description: "Example charge",
  source: token,
	}, function(err, charge) {
		if(err){
			res.json('you got an error')
		}else{
			console.log(charge)
			res.json({yo:"Payment Success! in the amount of", charge})
		}
	});
})

// Node Mailer Begins
// Node Mailer Begins
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'marcus@discovercs.com',
        pass: 'Myvault2'
    }
});

function sendAutoMail(clientData){
	let currentClient = clientData
	// setup email data with unicode symbols
	let mailOptions = {
	    from: '"Marcus Ogden" <marcus@discovercs.com>', // sender address
	    to: currentClient.email, // list of receivers
	    subject: 'DiscoverCS Payment Confirmation', // Subject line
	    html: '<p>Your payment of '+'<b>$'+currentClient.price+'</b>'+' for web and marketing services has been recieved!</p><br> <p>Thank you for choosing Discover CS, if you have questions or comments feel free to reply to this email</p>' // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
	    if (error) {
	        return console.log(error);
	    }
	    console.log('Message %s sent: %s', info.messageId, info.response);
	});
}

// Discover Stripe JS
app.post('/api/discovercs', function(req, res) {
	console.log(req.body)
	var token = req.body.token;
	var amount = req.body.amount;
	var currentClient = req.body.currentClient
	var charge = stripeDiscoverCS.charges.create({
  amount: amount,
  currency: "usd",
  description: "New Invoice Payment",
  source: token,
	}, function(err, charge) {
		if(err){
			res.json('you got an error')
		}else{
			sendAutoMail(currentClient)
			res.json({yo:"Payment Success! ", charge})
		}
	});
})


// Stripe Clients BEGIN
app.post('/api/stripe/charge/caosSports', function(req, res) {
    var stripeToken = req.body.stripeToken;
    var amount = req.body.amount;
		console.log(req.body, req.body.stripeToken)
    stripe.charges.create({
        card: stripeToken,
        currency: 'aud',
        amount: amount
    },
    function(err, charge) {
        if (err) {
            res.sendStatus(500, err);
        } else {
            res.sendStatus(204);
        }
    });
});
// Stripe ENDS







app.listen(8080 , function(){
  console.log('I\'m listening on port 8080 ');
})
