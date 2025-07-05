    // TODO:
    // Serve the conversation history in a separate route(filterBy characterId and userId) - done
    // fetch the {character_id}/messages route - done
    // Auto load the messages when the Dom content is loaded in the character chat window - done
    // Only display the assistant message served from the backend - done
    // Load the user message by default in the front end - done
    // clear the message input when the send button is pressed - done
    // disable the send button when the input field is empty - done
    // display the current response fron the model to the frontend - done
    // attach time and day (Format: Thur, 02 June 2025 - 05:02 AM) to messages converted with js time library
    // Refine the model to generate responses in plain text without any styles. - done
    // Modify token expiration time when the user logs in - done


    // Show typing animation as the assitant is thinking

const token = localStorage.getItem('token');
const active_character_id = localStorage.getItem('activeCharacterID')
const BASE_URL = 'https://bible-ai-chat.onrender.com/api/v1.0.0/characters' // base api url

// Get DOM Elements
let listMessagesHTML = document.querySelector('#messages-container')
const sendButton = document.querySelector('#send-button')
const messageInput = document.querySelector('#user-message')
const clearChatButton = document.querySelector('#clear-chat-button')
const loaderEl = document.querySelector('.loader')
const clearTextEl = document.querySelector('.clear-text')

// get the character details
const activeCharacterName = localStorage.getItem('activeCharacterName')
const activeCharacterProfile = localStorage.getItem('activeCharacterProfile')

messageInput.addEventListener('input', function(e){
    e.preventDefault()
        sendButton.style.display = 'block' 
})

// redirect the user if they are not logged in
if(!token){
    window.location.href = '/login.html'
}
// Function to add a message to the chat history
function addMessageToChat(message, senderType) {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble');
    messageBubble.classList.add(`${senderType}-message`);
    messageBubble.textContent = message;
    listMessagesHTML.appendChild(messageBubble);

    // Scroll to the bottom of the chat history
    listMessagesHTML.scrollTop = listMessagesHTML.scrollHeight;
}

async function startChat(){
    const userMessage = messageInput.value.trim()

    if (userMessage === ''){
        alert('Empty message field');
        return
    }

    // display the message to chat
    addMessageToChat(userMessage, 'user')
    messageInput.value = '' // clear the input field

    // show the loader for assistant typing once the user message is sent
    const typingLoaderEl = document.createElement('div')
    typingLoaderEl.classList.add('texting-loader', 'loader-container')
    listMessagesHTML.appendChild(typingLoaderEl)
    listMessagesHTML.scrollTop = listMessagesHTML.scrollHeight;

    try {
        const res = await fetch(`${BASE_URL}/${active_character_id}/chat`, { 
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'content': userMessage })
        })
        if (res.status === 401) {
                return res.json().then(data => {
                if (data.msg === "Token has expired" || data.msg === "Invalid token") {
                    console.log(data.msg)
                    // redirect the user to login
                    window.location.href = '/login.html'
                }
            });
        }
        else if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.message || 'Failed to get messages');
        }
        // work with the data here 
        const data = await res.json();
        const aiResponse = data.response;

        let assistantMessage = aiResponse[aiResponse.length - 1]
        
        let cleanedAssistantMessage = assistantMessage.content
        // remove the loader once the message is added to chat
        typingLoaderEl.remove()
        // add assistant response to chat
        addMessageToChat(cleanedAssistantMessage, 'assistant');
        listMessagesHTML.scrollTop = listMessagesHTML.scrollHeight;


    } catch (error){
        if(error.message){
            console.error('Error:', error.message);
            // remove the loader once the error is generated
            typingLoaderEl.remove()

            // add the error response to chat
            addMessageToChat('Error: Request failed due to server failure. Please try again later.');
        }
    }
}

// load character profile
let characterProfileEl = document.querySelector('#character-chat-profile')

characterProfileEl.src = activeCharacterProfile;

let characterNameEl = document.querySelector('#character-name')
characterNameEl.textContent = activeCharacterName;

// get messages to display on the chat page
async function getMessages(){
    try{
       const res = await fetch(`${BASE_URL}/${active_character_id}/messages`, { 
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        if (res.status === 401) {
            return res.json()
                .then(data => {
                    if (data.msg === "Token has expired" || data.msg === "Invalid token") {
                        // redirect the user to login
                        window.location.href = '/login.html'
                        console.log(data.msg)
                    }
            });
        }

        if (!res.ok) {
            let errorData = await res.json()
            throw new Error(errorData.message || 'Failed to get messages');
        }

        let resultsData = await res.json()

        let chatHistory = resultsData.response
        listMessagesHTML.innerHTML = ''
        chatHistory.forEach(item => {
            addMessageToChat(item.content, item.role)
        });

    } catch (error) {
        if(error.message){
            console.error('Error:', error.message);
            addMessageToChat('Error: Request failed due to server failure. Please try again later.');
        }
    }
}

sendButton.addEventListener('click', startChat)

messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { // Shift+Enter for new line
        e.preventDefault(); // Prevent default Enter key behavior (new line)
        startChat();
    }
});


window.addEventListener('DOMContentLoaded', function(e){
    e.preventDefault()
    getMessages(active_character_id)
})

// function to clear chat
async function clearChat(){
    try{
        const res = await fetch(`${BASE_URL}/${active_character_id}/chat/clear`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })

        if (res.status === 401) {
            return res.json()
                .then(data => {
                    if (data.msg === "Token has expired" || data.msg === "Invalid token") {
                        // redirect the user to login
                        window.location.href = '/login.html'
                    }
            });
        }

        if (!res.ok) {
            let errorData = await res.json()
            throw new Error(errorData.message || 'Failed to get messages');
        }

        const msg = await res.json()
        alert(msg.message)
        loaderEl.style.display = 'none'
        clearTextEl.style.display = 'block'

    } catch(error){
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
    }
}
// clear chat on button click
clearChatButton.addEventListener('click', function(e){
    e.preventDefault()
    clearChat()
    getMessages()

    loaderEl.style.display = 'block'
    clearTextEl.style.display = 'none'
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
        localStorage.removeItem('activeCharacterName')
        localStorage.removeItem('activeCharacterProfile')
        localStorage.removeItem('activeCharacterID')
    }
})


// remove current user from the localstorage when the chat is closed
document.querySelector('#close-chat-button').addEventListener('click', function(e){
    e.preventDefault()
    localStorage.removeItem('activeCharacterName')
    localStorage.removeItem('activeCharacterProfile')
    localStorage.removeItem('activeCharacterID')

    window.location.href = '/home.html'

})