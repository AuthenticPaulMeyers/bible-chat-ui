// Register users route
function registerUser(username, email, password, imageFile) {
    const formData = new FormData;

    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    if(imageFile){
        formData.append('image', imageFile)
    }
    
    fetch('https://bible-ai-rnlc.onrender.com/api/v1.0.0/auth/register', { 
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

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const image = document.getElementById('image').files[0];

  registerUser(username, email, password, image);
});
