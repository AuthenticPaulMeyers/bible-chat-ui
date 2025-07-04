
const loaderEl = document.querySelector('.loader');
const loginButtonEl = document.querySelector('#login-button');
const loginTextEl = document.querySelector('.login-text');

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // disable the button and enable the loader
  loaderEl.style.display = 'inline-block';
  loginButtonEl.disabled = true;

  if(loginButtonEl.disabled === true){
    loginButtonEl.style.background = 'gray';
    loginTextEl.style.display = 'none';
  }



  fetch('https://bible-ai-chat.onrender.com/api/v1.0.0/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(async response => {
    const data = await response.json();
    console.log(data)
  
    if (response.ok) {
          //Store token in localStorage
          //Redirect to user to the homepage
        localStorage.setItem('token', data.user.access);
        localStorage.setItem('username', data.user.name);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('profile_url', data.user.profile_picture);
        // enable the button and disable the loader
        loaderEl.style.display = 'none';
        loginButtonEl.disabled = false;
        loginTextEl.style.display = 'inline-block';
        // redirect the user to the home page
        window.location.href = '/home.html';




    }else{
        if(new Error(data.message)){
          alert("Internal Server failure our team is currently working on it")
        };
    }

  })
  .catch(error => {
    if(error.message){
        alert(error.message)
    }
  });
});

// toggle show password
const togglePassword = document.querySelector('#toggle-show-password')

togglePassword.addEventListener('click', function(e){

  e.preventDefault()

  const passwordInput = document.querySelector('#password')

  if (passwordInput.type === 'password'){
    passwordInput.type = 'text';
    document.querySelector('#toggle-show-password i').classList.remove('fa-eye')
    document.querySelector('#toggle-show-password i').classList.add('fa-eye-slash')

  }else{
    passwordInput.type = 'password';
    document.querySelector('#toggle-show-password i').classList.remove('fa-eye-slash')
    document.querySelector('#toggle-show-password i').classList.add('fa-eye')
  }
})