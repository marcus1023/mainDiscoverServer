
let currentClient = {
   price: 0,
   type: " ",
   client: " ",
   business: " ",
   email: " "
}



// Custome Customer invoice-inputs
// number paradigm - client - year - month - client+1
let allInvoices = [
  {
    invoiceStatus: false,
    invoiceNumber: 2170631,
    businessName: 'Quality Striping and Sealing',
    contactName: "Wayne Young",
    contactEmail: "marcus@discovercs.com",
    nextPayment: 1550,
    paymentType: "SEO Focused Website Rebuild"
  },
  {
    invoiceStatus: false,
    invoiceNumber: 3170641,
    businessName: 'The Purple Sheet Company',
    contactName: "Jayne Smith",
    contactEmail: "marcus@discovercs.com",
    nextPayment: 800,
    paymentType: "Gold Monthly Marketing Plan"
  },
  {
    invoiceStatus: true,
    invoiceNumber: 609111,
    businessName: 'Dads Big Test',
    contactName: "Charles Ogden",
    contactEmail: "charlesogden@managementit.com",
    nextPayment: 3,
    paymentType: "Stripe Testing"
  }
]

function openStripeForm(){
  let currentInvoice = Number(document.getElementById('invoice-number').value)
  console.log(currentInvoice)
  for(var i = 0; i < allInvoices.length; i++){
    if(allInvoices[i].invoiceNumber === currentInvoice && allInvoices[i].invoiceStatus === false){
      let selectClient = allInvoices[i]
      currentClient.price = selectClient.nextPayment
      currentClient.type = selectClient.paymentType
      currentClient.client = selectClient.contactName
      currentClient.business = selectClient.businessName
      currentClient.email = selectClient.contactEmail
      document.getElementById('payment-confirm').innerHTML = " $"+currentClient.price + "(USD)"
      document.getElementById('type-confirm').innerHTML = currentClient.type
      document.getElementById('client-name').innerHTML = currentClient.client
      document.getElementById('stripe-form').style.display = 'flex'
      return
    }else if(allInvoices[i].invoiceStatus === true){
      alert("You have submitted an invoice number that does not exist or has been paied. Please, double check your invoice number. Contact marcus@discovercs.com if you have questions.")
      document.getElementById('invoice-number').value = null
      return
    }
  }
}
let stripe = Stripe('pk_live_tbNAYaLhsNWJ9kNlMWnxRcJJ');
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
  document.getElementById('loading-payment').style.display = 'flex'
  stripe.createToken(card).then(function(result) {
    if (result.error) {
      document.getElementById('loading-payment').style.display = 'none'
      alert('Oh Dear, Seems something went wrong! Try again and double check your card info!')
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
      return
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
  $.ajax('https://discovercs.com/api/discovercs',{
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
  //  document.getElementById('loading-payment').style.display = 'none'
   alert("Thank you for your payment. Your payment has been processed and your companies registered contact email will recieve a confirmation within 24 hours. If you have questions or concerns feel free to contact us via email at marcus@discovercs.com")
  //  location.redirect
   let url = "http://www.discovercs.com/"
   window.location = url;
 });
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
  charger.amount = currentClient.price * 100
  charger.token = token.id
  charger.currentClient = currentClient
  apiPoster(charger)
}

function hideStripeForm(){
  document.getElementById('stripe-form').style.display = 'none'
  document.getElementById('stripe-form-shade').style.display = 'none'
  console.log('tester')
}
