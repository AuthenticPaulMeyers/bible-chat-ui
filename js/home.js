// a container to display all the characters when loaded
let listCharactersHTML = document.querySelector('.display-characters-container')

const username = localStorage.getItem('username')
const token = localStorage.getItem('token');
const user_email = localStorage.getItem('email')
const user_profile = localStorage.getItem('profile_url')

const BASE_URL = 'https://bible-ai-rnlc.onrender.com/api/v1.0.0/characters'

// redirect users to login
if(!token){
    window.location.href = '/login.html'
}

// display user profile on the home page
window.addEventListener('DOMContentLoaded', function(){

    document.getElementById('welcomeUser').textContent = username;
    this.document.getElementById('user-profile').src = user_profile;
    this.document.getElementById('user-name').textContent = username;

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
        const response = await fetch('https://bible-ai-rnlc.onrender.com/api/v1.0.0/characters/get-all', { 
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
            throw new Error(errorData.message || 'Failed to get messages');
        }
        
        // Work with the fetched data here (result)
        // Note that the fetched data returns a character lists of dictionaries
        // to access the data in the loop through the list to get each dictionary

        let results = await response.json()

        let characters = results.characters

        console.log(results)
        
        // add new datas
        if (characters.length > 0){

            characters.forEach(character => {
                let newCharacter = document.createElement('div');
                newCharacter.dataset.id = character.id;
                newCharacter.classList.add('flex')
                newCharacter.classList.add('flex-col')
                newCharacter.classList.add('items-center')
                newCharacter.classList.add('bg-primary')
                newCharacter.classList.add('rounded-lg')
                newCharacter.classList.add('shadow')
                newCharacter.classList.add('sm:flex')
                newCharacter.innerHTML = `
                    <div class="h-24 bg-secondary">
                        <img src="${character.profile_image_url} " height="50%" class="w-full sm:rounded sm:rounded-lg shrink-0" alt="Character profile Image">
                    </div>
                    <div class="flex flex-wrap align-center m-2">
                        <span class="text-md font-bold white">${character.name} | </span> 
                        <span class="text-md white px-1">${character.book}</span>
                    </div>
                    <button class="start-chat inline-flex justify-center items-center m-1 py-1 px-5 text-base font-sm primary rounded-lg bg-white">Chat <i class="mx-1 fa-regular fa-comment"></i></button>
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

window.addEventListener('DOMContentLoaded', function(e){
    e.preventDefault()
    getCharacter()
})