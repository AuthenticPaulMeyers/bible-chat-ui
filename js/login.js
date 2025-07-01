
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
          //Store token in localStorage
          //Redirect to user to the homepage
        localStorage.setItem('token', data.user.access);
        localStorage.setItem('username', data.user.name);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('profile_url', data.user.profile_picture);
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