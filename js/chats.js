const token = localStorage.getItem('token');
function startChat(character_id, message){
        fetch(`https://bible-ai-rnlc.onrender.com/api/v1.0.0/characters/${character_id}/chat`, { 
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'content': message })
    })
    .then(async (res) => {
        const results = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(results.message || 'Failed to get messages');
        }
                // work with the data here 
        let listMessagesHTML = document.querySelector('#messages-container')
        let messages = results.response

        messages.forEach(message => {
            let messageCard = document.createElement('div');
            messageCard.dataset.id = message.id;
            messageCard.innerHTML = `
                <p>${message.content}</p>
                <span>${message.role}</span>
        `;
        listMessagesHTML.appendChild(messageCard);
            
        });
    })

    // TODO:
    // Serve the conversation history in a separate route(filterBy characterId and userId)
    // fetch the {character_id}/messages route
    // Auto load the messages when the Dom content is loaded in the character chat window
    // Only display the assistant message served from the backend
    // Load the user message by default in the front end
    // clear the message input when the send button is pressed
    // disable the send button when the input field is empty
    // display the current response fron the model to the frontend
    // Refine the model to generate responses in plain text without any styles.

    .catch(error => {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
    });
}

let active_character_id = localStorage.getItem('activeCharacterID')

document.querySelector('#send-button').addEventListener('click', function(e){
    let userMessage = document.querySelector('#user-message').value
    e.preventDefault()
    startChat(active_character_id, userMessage)
})