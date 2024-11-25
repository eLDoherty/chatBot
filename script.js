document.getElementById('send-message').addEventListener('click', function() {
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

        // Send the message from the textarea to the API
        fetch(`https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodeURIComponent(messageContent)}&prompt=Pretend%20to%20be%20Leonardo`)
            .then(response => response.json())
            .then(data => {
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
            });
    }
});
