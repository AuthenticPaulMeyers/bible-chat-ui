
window.addEventListener('DOMContentLoaded', function(){
        // 1. Get token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
    try {
        // 2. Decode the JWT payload (the middle part)
        const base64Payload = token.split('.')[1];
        const decodedPayload = atob(base64Payload);
        const parsedToken = JSON.parse(decodedPayload);

        console.log(parsedToken)

        // 3. Update UI
        document.getElementById('welcomeUser').textContent = `Welcome, ${parsedToken.sub.username}`;
    } catch (error) {
        console.error('Error decoding token:', error);
        document.getElementById('welcomeUser').textContent = 'Welcome, User';
    }
    } else {
    // No token found — redirect to login or show default
    window.location.href = '/login.html'; // optional
    }
})
