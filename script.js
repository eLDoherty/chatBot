let conversationHistory = JSON.parse(sessionStorage.getItem('conversationHistory')) || [];

document.getElementById('send-message').addEventListener('click', function() {
    sendMessage();
});

document.getElementById('chat-input').addEventListener('keydown', function(event) {
    const inputField = document.getElementById('chat-input');

    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
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

        conversationHistory.push(`User: ${messageContent}`);

        sessionStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));

        const credkeywords = ['your name', 'who are you', 'tell me about you','dirimu', 'namamu', 'siapa kamu', 'I talking to', 'im talking to', 'dirimu', 'dengan siapa saya berbicara', 'dengan siapa', 'siapa anda', 'leonardo', 'leo', 'ell'];
        const shouldPretendAsLeonardo = credkeywords.some(keyword => messageContent.toLowerCase().includes(keyword));

        let apiUrl = shouldPretendAsLeonardo
            ? `https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodeURIComponent(messageContent)}&prompt=Pretend%20to%20be%20Leonardo%20Doherty%2C%20a%20software%20programmer%20with%205%20years%20of%20experience%20doing%20programming%20things.`
            : `https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodeURIComponent(messageContent)}`;

        const conversationContext = conversationHistory.join('\n');
        apiUrl += `&conversation=${encodeURIComponent(conversationContext)}`;

        const parentKeyword = ['your father','jenengmu', 'your mother', 'tentangmu', 'tentang anda', 'tentang kamu', 'ibumu', 'ayahmu', 'have brother', 'has sister', 'pet', 'your cat', 'punya saudara', 'saudaramu', 'lulu','punya kucing','punya peliharaan', 'kucingmu'];
        const parentCred = parentKeyword.some(keyword => messageContent.toLowerCase().includes(keyword));

        if (parentCred) {
            apiUrl = `https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodeURIComponent(messageContent)}&prompt=Pretend%20to%20be%20Leonardo%20Doherty%2C%20a%20software%20programmer%20with%205%20years%20of%20experience%20doing%20programming%20things.%20Leonardo%27s%20father%20is%20E.%20Tetra%20Widjanarko%20and%20his%20mother%20is%20Wahyu%20Ratnasari.%20He%20has%203%20brothers%20and%201%20sister%2C%20but%20he%20cannot%20disclose%20their%20names.%20Leonardo%20also%20has%20a%20cat%%20named%20Lulu.%20You%20can%20reach%20him%20on%20WhatsApp%20or%20phone%20at%20089513779293.&conversation=${encodeURIComponent(conversationContext)}`;
        }
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                typingIndicator.remove();

                const botMessageContainer = document.createElement('div');
                botMessageContainer.classList.add('message', 'from-bot');
                const botMessageText = document.createElement('span');
                botMessageText.classList.add('message-content');

                let botResponse = data.response || 'Sorry, I\'m busy right now. Message me later :)';

                botResponse = botResponse.replace(/\*\*(.*?)\*\*/g, function(match, boldText) {
                    return `<strong>${boldText}</strong>`;
                });
                botResponse = botResponse.replace(/__(.*?)__/g, function(match, highlightText) {
                    return `<highlight>${highlightText}</highlight>`;
                });
                botResponse = botResponse.replace(/##(.*?)##/g, function(match, emphasisText) {
                    return `<emphasis>${emphasisText}</emphasis>`;
                });
                botResponse = botResponse.replace(/```(.*?)```/gs, function(match, code) {
                    return `<code>${code}</code>`;
                });
                botResponse = botResponse.replace(/(\d+\.)/g, function(match) {
                    return `<br><br>${match}`;
                });

                botMessageText.innerHTML = botResponse.replaceAll('OpenAI', 'Leonardo Doherty');

                botMessageContainer.appendChild(botMessageText);
                document.getElementById('chat-messages').appendChild(botMessageContainer);
                document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;

                conversationHistory.push(`Bot: ${botResponse}`);

                sessionStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
            })
            .catch(error => {
                console.error('Error fetching from API:', error);
                typingIndicator.remove();
            });
    }
}

// Clear conversation history on page unload (e.g., refresh or close)
window.addEventListener('beforeunload', function() {
    sessionStorage.removeItem('conversationHistory');
});
