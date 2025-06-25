
  const message = localStorage.getItem('resetMessage');
  document.getElementById('requestMessage').textContent = message || 'No message found.';
  localStorage.removeItem('resetMessage');  // optional: clear after use

