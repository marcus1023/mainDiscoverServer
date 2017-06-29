let suitPrice = 0
let suitType = "x"
function openStripeForm(price, type){
  suitPrice = price
  suitType = type
  document.getElementById('payment-confirm').innerHTML = "$" + suitPrice + "(AUD)"
  document.getElementById('type-confirm').innerHTML = suitType
  console.log(suitPrice, suitType)
  document.getElementById('stripe-form').style.display = 'flex'
  document.getElementById('stripe-form-shade').style.display = 'flex'
}
let stripe = Stripe('pk_test_kA3wS31hOAFKooRGLboUrLWf');
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
var style = {
  base: {
    // Add your base input styles here. For example:
    fontSize: '16px',
    lineHeight: '24px'
  }
};

// Create an instance of the card Element
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>
card.mount('#card-element');
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Create a token or display an error when the form is submitted.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      alert('Oh Dear, Seems something went wrong! Try again and double check your card info!')
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {

      console.log(result)
      // Send the token to your server
      stripeTokenHandler(result.token);
    }
  });
});
//I'm the server ;)
function apiPoster(info){
  console.log('info in poster',info)
  $.ajax('http://localhost:8080/api/apetest',{
   data : JSON.stringify(info),
   contentType : 'application/json',
   type : 'POST',
 }).then(function(res){
   console.log(res.charge.id)
   console.log(res.charge)
   let newCustomer = {
     id: res.charge.id,
     amount: res.charge.amount/100,
     paid: res.charge.paid,
   }
   hideConfirmPop()
   document.getElementById('loading-payment').style.display = 'none'
   alert('Congrats! you just got yourself a new suit! you paied $' + newCustomer.amount + ' (AUD). your customer satisfaction ID is '+ newCustomer.id )

 });
 document.getElementById('loading-payment').style.display = 'flex'
}
function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);
  console.log('submitted and done', token)
  let charger = {}
  charger.amount = suitPrice * 100
  charger.token = token.id
  apiPoster(charger)
}

function hideStripeForm(){
  document.getElementById('stripe-form').style.display = 'none'
  document.getElementById('stripe-form-shade').style.display = 'none'
  console.log('tester')
}
