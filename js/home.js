// a container to display all the characters when loaded
let listCharactersHTML = document.querySelector('.display-characters-container')

const username = localStorage.getItem('username')
const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded', function(){

    if (token) {

        document.getElementById('welcomeUser').textContent = `Welcome, ${username}`;
    
    } else {
        // redirect to login by default
        window.location.href = '/login.html'; 
    }
})

// logout
document.querySelector('#logout-btn').addEventListener('click', function(e){
    e.preventDefault();
    if (token)  {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('email')
        localStorage.removeItem('profile_picture')
        window.location.href = '/login.html'
    }
})


function getCharacter(){
    fetch('https://bible-ai-rnlc.onrender.com/api/v1.0.0/characters/get-all', { 
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(async (response) => {
        const results = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(results.message || 'Failed to get characters');
    }
    // Work with the fetched data here (result)
    // Note that the fetched data returns a character lists of dictionaries
    // to access the data in the loop through the list to get each dictionary

    let characters = results.characters
    // add new datas
    if (characters.length > 0){

        characters.forEach(character => {
            let newCharacter = document.createElement('div');
            newCharacter.dataset.id = character.id;
            newCharacter.innerHTML = `
                <img src="${character.profile_image_url}" height="200px" alt="Character profile Image">
                <h3>${character.name}</h3>
                <span>${character.book}</span>
                <button class="start-chat">Message</button>
        `;
        listCharactersHTML.appendChild(newCharacter);
            
        });
    }
    
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
    });
}
// get the character id
listCharactersHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('start-chat')){
        let id_character = positionClick.parentElement.dataset.id;
        window.location.href='/chat.html'
        localStorage.setItem('activeCharacterID', id_character)
    }
})



window.addEventListener('DOMContentLoaded', function(e){
    e.preventDefault()
    getCharacter()
})