document.getElementById('send-message').addEventListener('click', function() {
    sendMessage();
});

document.getElementById('chat-input').addEventListener('keydown', function(event) {
    const inputField = document.getElementById('chat-input');

    // If the Enter key is pressed (without Shift), send the message
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent adding a new line
        sendMessage();
    }
});

// Function to send message
function sendMessage() {
    const inputField = document.getElementById('chat-input');
    const messageContent = inputField.value.trim();

    if (messageContent) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message', 'from-user');
        const messageText = document.createElement('span');
        messageText.classList.add('message-content');
        messageText.textContent = messageContent;
        messageContainer.appendChild(messageText);

        document.getElementById('chat-messages').appendChild(messageContainer);

        inputField.value = '';

        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;

        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'from-bot', 'typing');
        typingIndicator.innerHTML = '<span class="typing-indicator">Leonardo is typing...</span>';
        document.getElementById('chat-messages').appendChild(typingIndicator);

        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;

        const keywords = ['your name', 'are you', 'who are you', 'namamu', 'siapa kamu'];
        const shouldPretendAsLeonardo = keywords.some(keyword => messageContent.toLowerCase().includes(keyword));

        const apiUrl = shouldPretendAsLeonardo
            ? `https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodeURIComponent(messageContent)}&prompt=Pretend%20to%20be%20Leonardo`
            : `https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodeURIComponent(messageContent)}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                typingIndicator.remove();

                const botMessageContainer = document.createElement('div');
                botMessageContainer.classList.add('message', 'from-bot');
                const botMessageText = document.createElement('span');
                botMessageText.classList.add('message-content');
                botMessageText.textContent = data.response || 'No response from AI.';
                botMessageContainer.appendChild(botMessageText);

                document.getElementById('chat-messages').appendChild(botMessageContainer);

                document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
            })
            .catch(error => {
                console.error('Error fetching from API:', error);
                typingIndicator.remove(); // Remove typing indicator on error
            });
    }
}
