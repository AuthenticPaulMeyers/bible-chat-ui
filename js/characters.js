// Register users route

// Check if token exists
const token = localStorage.getItem('token');

if (!token) {
  // Redirect unauthenticated user to login
  window.location.href = '/login.html';
}

function addCharacter(name, description, book, imageFile) {
    const formData = new FormData;

    formData.append('name', name);
    formData.append('description', description);
    formData.append('book', book);
    if(imageFile){
        formData.append('image', imageFile)
    }
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    fetch('https://api-bible-ai.onrender.com/api/v1.0.0/characters/add', { 
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: formData
    })
    .then(async (response) => {
        const result = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(result.message || 'Failed to add character');
    }
        console.log("Added:", result);
        alert("Added new character successfully!");
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
    });
    }

// get values from the
document.getElementById('addCharacterForm').addEventListener('submit', function(event) {
  event.preventDefault(); // prevent form submission reload

  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const book = document.getElementById('book').value;
  const image = document.getElementById('image').files[0];

  console.log(name, description, book, image)

  addCharacter(name, description, book, image);
});

function getCharacter(){
    fetch('https://api-bible-ai.onrender.com/api/v1.0.0/auth/me', { 
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(async (response) => {
        const result = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(result.message || 'Failed to get user profile');
    }
        console.log(result);
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
    });
}

document.querySelector('#get-characters-btn').addEventListener('click', function(e){
    e.preventDefault()

    getCharacter()
})