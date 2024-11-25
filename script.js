document.getElementById('send-message').addEventListener('click', function() {
    sendMessage();
});

document.getElementById('chat-input').addEventListener('keydown', function(event) {
    const inputField = document.getElementById('chat-input');

    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent adding a new line
        sendMessage();
    }
});

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

        const keywords = ['your name', 'are you', 'who are you', 'tell me about you', 'namamu', 'siapa kamu', 'I talking to', 'im talking to'];
        const shouldPretendAsLeonardo = keywords.some(keyword => messageContent.toLowerCase().includes(keyword));

        const apiUrl = shouldPretendAsLeonardo
            ? `https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodeURIComponent(messageContent)}&prompt=Pretend%20to%20be%20Leonardo%20Doherty%2C%20a%20software%20engineer%20with%205%20years%20of%20experience%20doing%20programming%20things.`
            : `https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodeURIComponent(messageContent)}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                typingIndicator.remove();
                const botMessageContainer = document.createElement('div');
                botMessageContainer.classList.add('message', 'from-bot');
                const botMessageText = document.createElement('span');
                botMessageText.classList.add('message-content');

                let botResponse = data.response || 'Sorry, I\'m busy right now. Message me later :)';

                    // Replace **bold** with <string>
                    botResponse = botResponse.replace(/\*\*(.*?)\*\*/g, function(match, boldText) {
                        return `<strong>${boldText}</strong>`;
                    });
    
                    // Replace __highlight__ with <highlight>
                    botResponse = botResponse.replace(/__(.*?)__/g, function(match, highlightText) {
                        return `<highlight>${highlightText}</highlight>`;
                    });
    
                    // Replace ##emphasis## with <emphasis>
                    botResponse = botResponse.replace(/##(.*?)##/g, function(match, emphasisText) {
                        return `<emphasis>${emphasisText}</emphasis>`;
                    });
    
                    // If the response contains any code block (wrapped with ```), replace it with <code> tags
                    botResponse = botResponse.replace(/```(.*?)```/gs, function(match, code) {
                        return `<code>${code}</code>`;
                    });

                    botResponse = botResponse.replace(/(\d+\.)/g, function(match) {
                        return `<br><br>${match}`;
                    });
                
                botMessageText.innerHTML = botResponse;

                botMessageContainer.appendChild(botMessageText);
                document.getElementById('chat-messages').appendChild(botMessageContainer);

                document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
            })
            .catch(error => {
                console.error('Error fetching from API:', error);
                typingIndicator.remove();
            });
    }
}
