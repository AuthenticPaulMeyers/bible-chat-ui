
// TODO: 
// 1. Implement a loader when the chat button is clicked
// 

// Global array to store fecthed characters
let allCharacters = []
let allCharactersSearch = []

let listCharactersHTML = document.querySelector('.display-characters-container')

const username = localStorage.getItem('username')
const token = localStorage.getItem('token');
const user_email = localStorage.getItem('email')
const user_profile = localStorage.getItem('profile_url')

// redirect users to login
if(!token){
    window.location.href = '/login.html'
}

// display user profile on the home page
window.addEventListener('DOMContentLoaded', function(){

    document.getElementById('welcomeUser').textContent = username.capitalize();
    this.document.getElementById('user-profile').src = user_profile;
    this.document.getElementById('user-name').textContent = username.capitalize();

})

// logout
document.querySelector('#logout-btn').addEventListener('click', function(e){
    e.preventDefault();
    if (token)  {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('email')
        localStorage.removeItem('profile_picture')
        window.location.href = '/index.html'
    }
})


async function getCharacter(){

    try{
        const response = await fetch('https://bible-ai-chat.onrender.com/api/v1.0.0/characters/get-all', { 
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            credentials: 'include'
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
            throw new Error(errorData.message);
        }
        
        // Work with the fetched data here (result)
        // Note that the fetched data returns a character lists of dictionaries
        // to access the data, loop through the list to get each dictionary

        let results = await response.json()

        let characters = results.characters

        allCharacters = characters
        
        // add new datas
        if (characters.length > 0){

            allCharactersSearch = characters.map(character => {
                let newCharacter = document.createElement('div');
                newCharacter.innerHTML = `
                    <div class="character-card">
                        <div class="image-container">
                            <img src="${character.profile_image_url} "h-auto max-w-full rounded-lg" alt="Character profile Image">
                        </div>
                        <div class="card-details" data-id="${character.id}">
                            <div class="m-1">
                                <span class="font-bold white">${character.name} <br> </span> 
                                <span class="book-name white">${character.book}</span>
                            </div>
                                <button class="start-chat inline-flex justify-center items-center py-1 px-5 text-base font-sm primary rounded-lg bg-white cursor-pointer">Chat <i class="mx-1 fa-regular fa-comment"></i></button>
                        </div>
                    </div>
            `;
            listCharactersHTML.appendChild(newCharacter);

            return {name: character.name, element: newCharacter, book: character.book}
                
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
        let id_character = Number(positionClick.parentElement.dataset.id);

        localStorage.setItem('activeCharacterID', id_character)
        window.location.href = '/chat.html'

        allCharacters.forEach(character => {
            if (id_character === character.id){
                localStorage.setItem('activeCharacterName', character.name)
                localStorage.setItem('activeCharacterProfile', character.profile_image_url)
            }
        }) 
    }
})

window.addEventListener('DOMContentLoaded', function(e){
    e.preventDefault()
    getCharacter()
})

// search characters in the home page
const searchButton = document.querySelector('#search-button')
const searchInput = document.querySelector('#default-search')

searchInput.addEventListener('input', (e) => {
    e.preventDefault()
    const value = searchInput.value.toLowerCase()

    allCharactersSearch.forEach(character =>{
        const isVisible = character.name.toLowerCase().includes(value) || character.book.toLowerCase().includes(value)
            character.element.classList.toggle('hide', !isVisible)
            // document.querySelector('#search-result-message').style.display('block')
    })
})