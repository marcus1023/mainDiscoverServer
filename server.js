var express = require('express');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var config = require('./config.js');
var passport = require('passport');
var massive = require('massive');
var connect = massive.connectSync({connectionString: config.connectionString});
var massiveInstance = massive.connectSync({connectionString : config.connectionString})
var app = module.exports = express();
var nodemailer = require('nodemailer');
var cms = require('./controllers/cms.js');
var fs = require('fs');
var router = express.Router();
var stripe = require('stripe')('sk_test_jy88Pcb4D72y1Jlt3DUCT4wg');

//DB controllers required
let usersCtlr = require('./controllers/users.js') ;

app.set('db', massiveInstance);
var db = app.get('db');

var corsOptions = {
	origin: 'http://localhost:3000/'
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());
app.use('/sayHello', router);

app.use(session({
	secret: config.sessionSecret,
	resave: true,
	saveUninitialized: false,
	cookie: {
		maxAge:(1000*60*60*24*7)
	}
}));


// system API routes
	app.post('/api/createNewUser', usersCtlr.createNewUser);
	app.post('/api/authenticate', usersCtlr.authenticate);
	app.post('/api/addToSubscript', usersCtlr.addToSubscript);
	app.post('/api/purchaseType', usersCtlr.purchaseType);
	app.post('/api/newClient', usersCtlr.newClient);
	app.post('/api/runningTotal', usersCtlr.runningTotal);
	app.post('/api/createEvent', usersCtlr.createEvent);
	app.post('/api/saveCms', cms.saveCms);
	app.post('/api/selectCourse', usersCtlr.selectCourse);
	app.post('/api/saveNewTesty', usersCtlr.saveNewTesty);
	app.post('/api/confirmCohort', usersCtlr.confirmCohort);
	app.post('/api/addPeopleToClass', usersCtlr.addPeopleToClass);
	app.post('/api/confirmPayment', usersCtlr.confirmPayment);
	app.post('/api/getClassSize', usersCtlr.getClassSize);
	app.post('/api/addEBspecial', usersCtlr.addEBspecial);
	app.post('/api/deferPayment', usersCtlr.deferPayment);
	app.get('/api/connectUser', usersCtlr.connectUser);
	app.get('/api/getClient', usersCtlr.getClient);
	app.get('/api/cmsConnect', cms.cmsConnect);
	app.get('/api/termsOfService', usersCtlr.termsOfService);
	app.get('/api/getAllevents', usersCtlr.getAllevents);
	app.get('/api/getTestys', usersCtlr.getTestys);
	app.get('/api/getebTimer', usersCtlr.getebTimer);
	app.get('/api/getAllStudents', usersCtlr.getAllStudents);
	app.get('/api/getClassClient', usersCtlr.getClassClient);



	//EMAIL OUTLINE BEGIN
	app.post('/api/contactEmail', function handleSayHello(req, res) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'marcuslogden@gmail.com', // Your email id
            pass: 'NCCode24' // Your password
        }
    });
		var message = req.body.message
		var name = req.body.name
		var email = req.body.email
		var mailOptions = {
		    from: 'marcuslogden@gmail.com', // sender address
		    to: email, // list of receivers
		    subject: 'New Excell Infinity Contact!', // Subject line
		    html: '<b>New email from: </b>' + name + '<br><br>' + '<b>Message:</b> ' + message //, // plaintext body
		};
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        console.log(error);
		        res.json({yo: 'error'});
		    }else{
		        console.log('Message sent: ' + info.response);
		        res.json({yo: info.response});
		    };
		});
});
	app.post('/api/sendConfirmationEmail', function handleSayHello(req, res) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'benne@excelinfinity.com', // Your email id
            pass: 'NCCode24' // Your password
        }
    });
		var message = req.body.message
		var name = req.body.name
		var email = req.body.email
		var mailOptions = {
		    from: 'marcuslogden@gmail.com', // sender address
		    to: email, // list of receivers
		    subject: 'New Excell Infinity Contact!', // Subject line
		    html: '<b>New email from: </b>' + name + '<br><br>' + '<b>Message:</b> ' + message //, // plaintext body
		};
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        console.log(error);
		        res.json({yo: 'error'});
		    }else{
		        console.log('Message sent: ' + info.response);
		        res.json({yo: info.response});
		    };
		});
});
	app.post('/api/sendRegisteredEmail', function handleSayHello(req, res) {
		let emailCont = req.body
		let cohortId = req.body.currentClient.cohort
		let total = req.body.currentClient.total
		let clientName = emailCont.currentClient.info.pasportName
		let clientId = emailCont.currentClient.userid
		let clientEmail = emailCont.currentClient.info.email
		console.log(req.body)
		db.getSingleCohort([cohortId ], function (err, result) {
			cohortinfo = result[0]
		let cohortDates = cohortinfo.datebeauty + "through" +cohortinfo.datebeauty2
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'marcuslogden@gmail.com', // Your email id
            pass: 'NCCode24' // Your password
        }
    });
		var email = req.body.email
		var mailOptions = {
		    from: 'marcuslogden@gmail.com', // sender address
		    to: clientEmail, // list of receivers
		    subject: 'New Excell Infinity Registry!', // Subject line
		    html: '<b>New email from: </b>Excel Infinity' + '<br><br>' + '<b>Message:</b><p>Hey there! Looks like you registered for a course with excel infinity</p><h4>Account Info</h4><br><p>Name: '+clientName+'<b></b></p><br><p>Customer Id: '+clientId+'<b></b></p><br><p>Payment Made: Yes<b></b></p><br><p>Payment Ammount: '+total+'<b></b></p><br><p>Course Id: '+cohortId+'<b></b></p><br><p>Course Dates: '+cohortDates+'<b></b></p><br> ' //, // plaintext body
		};
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        console.log(error);
		        res.json({yo: 'error'});
		    }else{
		        console.log('Message sent: ' + info.response);
		        res.json({yo: info.response});
		    };
		});
	})
});
	app.post('/api/sendDeferPaymentEmail', function handleSayHello(req, res) {
		console.log('sendDeferPaymentEmail',req.body)
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'marcuslogden@gmail.com', // Your email id
            pass: 'NCCode24' // Your password
        }
    });
		var email = req.body.email
		var mailOptions = {
		    from: 'marcuslogden@gmail.com', // sender address
		    to: 'marcus@userlite.com', // list of receivers
		    subject: 'New Excell Infinity Registry!', // Subject line
		    html: '<b>New email from: </b>Excel Infinity' + '<br><br>' + '<b>Message:</b><p>Hey there! Looks like you registered for a course with excel infinity</p><h4>Account Info:</h4><br><p>Name: '+req.body.name+'<b></b></p><br><p>Customer Id: '+req.body.id+'<b></b></p><br><p>Payment Made: Yes<b></b></p><br><p>Payment Amount: '+req.body.amount+'<b></b></p><br><p>Course Id: '+req.body.courseId+'<b></b></p><br><p>Course Dates: '+req.body.dates.start+' - '+req.body.dates.end+'<b></b></p><br> ' //, // plaintext body
		};
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        console.log(error);
		        res.json({yo: 'error'});
		    }else{
		        console.log('Message sent: ' + info.response);
		        res.json({yo: info.response});
		    };
		});
});

//EMAIL OUTLINE ENDED


// Stripe BEGINS
app.post('/api/charge', function(req, res) {
    var stripeToken = req.body.stripeToken;
    var amount = req.body.ammount;
		console.log(req.body, req.body.stripeToken)
    stripe.charges.create({
        card: stripeToken,
        currency: 'usd',
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
