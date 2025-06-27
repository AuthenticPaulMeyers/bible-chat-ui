
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('https://bible-ai-rnlc.onrender.com/api/v1.0.0/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(async response => {
    const data = await response.json();

    if (response.ok) {
        window.location.href = '/home.html';
        alert("Login successful.")
        localStorage.setItem('token', data.user.access);
        localStorage.setItem('username', data.user.name);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('profile_url', data.user.profile_picture);
        console.log(data)
    }else{
        throw new Error(data.message || 'Login failed');
    }

    //Store JWT in localStorage (or cookie if needed)

    //Redirect to homepage
    
  })
  .catch(error => {
    console.error('Login error:', error.message);
    alert(`Login failed: ${error.message}`);
  });
});


