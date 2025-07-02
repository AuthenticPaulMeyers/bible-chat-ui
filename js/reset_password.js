
document.getElementById('resetPasswordForm').addEventListener('submit', function(e){
    e.preventDefault()

    const email = document.getElementById('email').value;

    fetch('https://bible-ai-chat.onrender.com/api/v1.0.0/auth/reset-password-request', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
  })
  .then(async response => {
    const data = await response.json();

    if (response.ok) {
        window.location.href = '/request-sent.html';
        localStorage.setItem('resetMessage', data.message)
        
    }else{
        throw new Error(data.message || 'Request failed');
    }

        
  
    })
    .catch(error => {
    console.error('Request error:', error.message);
    alert(`Request failed: ${error.message}`);
    })
});


document.getElementById('resetForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const password = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  //Extract the token from the URL
    const token = window.location.pathname.split('/').pop();

  if (!token) {
    console.log('Invalid token')
    return;
  }

  //Send new password to the backend
  try {
    const response = await fetch(`https://bible-ai-chat.onrender.com/api/v1.0.0/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('statusMessage').textContent = data.message || "Password reset successful!";
    } else {
      document.getElementById('statusMessage').textContent = data.message || "Reset failed.";
    }

  } catch (err) {
    document.getElementById('statusMessage').textContent = "Something went wrong.";
    console.error(err);
  }
});

