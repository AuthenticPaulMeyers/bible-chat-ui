// a container to display all the characters when loaded
let listCharactersHTML = document.querySelector('.display-characters-container')

const username = localStorage.getItem('username')
const token = localStorage.getItem('token');

const BASE_URL = 'https://bible-ai-rnlc.onrender.com/api/v1.0.0/characters'

// redirect users to login
if(!token){
    window.location.href = '/login.html'
}

// display user profile on the home page
window.addEventListener('DOMContentLoaded', function(){

    document.getElementById('welcomeUser').textContent = `Welcome, ${username}`;

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


async function getCharacter(){

    try{
        const response = await fetch(`${BASE_URL}/get-all`, { 
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })

        if (response.status === 401) {
            return response.json().then(data => {
                if (data.msg === "Token has expired" || data.msg === "Invalid token") {
                    // redirect the user to login
                    window.location.href = '/login.html'
                }
            });
        }
         if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to get messages');
        }
        
        // Work with the fetched data here (result)
        // Note that the fetched data returns a character lists of dictionaries
        // to access the data in the loop through the list to get each dictionary

        let results = await response.json()

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
    
    } catch(error) {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
    }
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

window.addEventListener('DOMCOntentLoaded', function(e){
    e.preventDefault()
    getCharacter()
})