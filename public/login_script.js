const API_BASE_URL = '/api/users'; 

const form = document.getElementById('login-form');
const email_input = document.getElementById('email');
const password_input = document.getElementById('password');
const login_button = document.getElementById('login-btn');
const forgotPassword_link = document.getElementById('forgot-password-link');
const newUser = document.getElementById('new-user');
const error_message = document.getElementById('error-message');
form.addEventListener('submit', (e) => {
//e.pre ventDefault();
let error =[];
  error = getLoginFormErrors(email_input, password_input);

    if (error.length > 0) {
        e.preventDefault()
        error_message.innerText = error.join(', ')
    }else {
        // No errors, redirect to homepage
        e.preventDefault(); // Prevent default form submission
        window.location.href = 'homepage.html'; // Change to your homepage file
    }
})

function getLoginFormErrors(email, password) {
    let error = [];
    if (email.value === '' || email.value === null ) {
        error.push('invalid email');
        email_input.parentElement.classList.add('incorrect');
    }
    
    if (password.value === ''|| password.value === null) {
        error.push('invalid password');
        password_input.parentElement.classList.add('incorrect');
    }
    else{

    }
    return error;
}
const allInputs = [email_input, password_input].filter(input => input != null)

allInputs.forEach(input => {
  input.addEventListener('input', () => {
    if(input.parentElement.classList.contains('incorrect')){
      input.parentElement.classList.remove('incorrect')
      error_message.innerText = '';
      updateLoginButtonState();
    }
  });
});

email_input.addEventListener('input', function() {
    const value = email_input.value.trim();
    
    if (value !== '' && !value.includes('@')) {
      email_input.parentElement.classList.add('incorrect');
      email_input.parentElement.classList.remove('correct');
      error_message.innerText = 'not an email';
    } else if (value !== '' && value.includes('@')) {
      email_input.parentElement.classList.remove('incorrect');
      email_input.parentElement.classList.add('correct');
      error_message.innerText = '';
    } else {
      email_input.parentElement.classList.add('incorrect');
      email_input.parentElement.classList.remove('correct');
      error_message.innerText = '';
    }
    updateLoginButtonState();
  });
  password_input.addEventListener('input', function() {
    const value = password_input.value.trim();
    
    if (value !== '' && value.length < 5) {
      password_input.parentElement.classList.add('incorrect');
      password_input.parentElement.classList.remove('correct');
      error_message.innerText = 'password is too short';
    } else if (value !== '' && value.length >= 5) {
      password_input.parentElement.classList.remove('incorrect');
      password_input.parentElement.classList.add('correct');
      error_message.innerText = '';
    } else {
      password_input.parentElement.classList.add('incorrect');
      password_input.parentElement.classList.remove('correct');
      error_message.innerText = '';
    }
    updateLoginButtonState();
  });
  function updateLoginButtonState() {
    const email = email_input.value.trim();
    const password = password_input.value.trim();
    const isEmailValid = email.includes('@');
    const isPasswordFilled = password.length >= 5;
    
    if (isEmailValid && isPasswordFilled) {
      login_button.classList.add('active');
      login_button.classList.remove('inactive');
    } else {
      login_button.classList.remove('active');
      login_button.classList.add('inactive');
    }
  }
  
  updateLoginButtonState();