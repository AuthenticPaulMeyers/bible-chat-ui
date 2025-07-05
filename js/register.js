const loaderEl = document.querySelector('.loader');
const registerButtonEl = document.querySelector('#register-button');
const registerTextEl = document.querySelector('.register-text');

// Register users route
function registerUser(username, email, password, imageFile) {
    const formData = new FormData;

    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    if(imageFile){
        formData.append('image', imageFile)
    }
    
    fetch('https://bible-ai-chat.onrender.com/api/v1.0.0/auth/register', { 
        method: 'POST',
        body: formData
    })
        .then(async (response) => {
            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }
                console.log("Registered:", result);
                alert("Registration successful!");
                // enable the button and disable the loader
                loaderEl.style.display = 'none';
                registerButtonEl.style.background = '#1a202c';
                registerButtonEl.disabled = false;
                registerTextEl.style.display = 'inline-block';
                
                // redirect the user to login
                window.location.href='/login.html'
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
    });
    }

// get values from the
document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault(); // prevent form submission reload

// disable the button and enable the loader
  loaderEl.style.display = 'inline-block';
  registerButtonEl.disabled = true;

  if(registerButtonEl.disabled === true){
    registerButtonEl.style.background = '#1a202c';
    registerTextEl.style.display = 'none';
  }


  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const image = document.getElementById('image').files[0];

  registerUser(username, email, password, image);
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