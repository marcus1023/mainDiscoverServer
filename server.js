var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = module.exports = express();
var router = express.Router();
var stripe = require('stripe')('sk_test_jy88Pcb4D72y1Jlt3DUCT4wg');


app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use(session({
	secret: "thidsdszdkfjskljdislkjsdfius777the8ewr938SSSec23",
	resave: true,
	saveUninitialized: false,
	cookie: {
		maxAge:(1000*60*60*24*7)
	}
}));

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
