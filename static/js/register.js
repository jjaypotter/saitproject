// load the function when the webpage is initialized
function init() {
// get the DOM of the registration form

const form1 = document.querySelector("form");
form1.addEventListener('submit', function(event) {
event.preventDefault();
let postcode = document.getElementById('postcode');
let pcode = postcode.value;

//setup the verification regular expression
const regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

// verify the postcode value and submit the form if all value are correct formatted
if (regex.test(pcode)) {
  this.submit
  window.alert('You have successful submitted the registration form. Thank you!')
} else {
  postcode.value = ''
  postcode.style = 'color:red'
};})

};

init();

