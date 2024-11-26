let conversationHistory = JSON.parse(localStorage.getItem('conversationHistory')) || [];

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
        localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));

        const credkeywords = ['your name', 'who are you', 'tell me about you', 'dirimu', 'namamu', 'siapa kamu', 'I talking to', 'im talking to', 'dirimu', 'dengan siapa saya berbicara', 'dengan siapa', 'siapa anda', 'leonardo', 'leo', 'ell', 'doherty'];
        const shouldPretendAsLeonardo = credkeywords.some(keyword => messageContent.toLowerCase().includes(keyword));

        const parentKeyword = ['your father', 'jenengmu', 'your mother', 'tentangmu', 'tentang anda', 'tentang kamu', 'ibumu', 'ayahmu', 'have brother', 'has sister', 'pet', 'your cat', 'punya saudara', 'saudaramu', 'lulu', 'punya kucing', 'punya peliharaan', 'kucingmu'];
        const parentCred = parentKeyword.some(keyword => messageContent.toLowerCase().includes(keyword));

        let prompt = conversationHistory.join('\n');
        prompt += `\nUser: ${messageContent}`;

        if (shouldPretendAsLeonardo) {
            prompt = `Pretend to be Leonardo Doherty, a software programmer with 5 years of experience. ${prompt}`;
        } else if (parentCred) {
            prompt = `Pretend to be Leonardo Doherty, a software programmer with 5 years of experience. Leonardo's father is E. Tetra Widjanarko, and his mother is Wahyu Ratnasari. He has 3 brothers and 1 sister, but he cannot disclose their names. Leonardo also has a cat named Lulu. ${prompt}`;
        }

        const apiUrl = `https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodeURIComponent(messageContent)}&prompt=${encodeURIComponent(prompt)}`;

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

                botResponse = botResponse.replace(/###(.*?):/g, function(match, headerText) {
                    return `<h3>${headerText}</h3>`;
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

                botMessageText.innerHTML = formatBotResponse(botResponse.replaceAll('OpenAI', 'Leonardo Doherty').replaceAll('Sebagai AI', 'Sebagai AI Leonardo'));

                botMessageContainer.appendChild(botMessageText);
                document.getElementById('chat-messages').appendChild(botMessageContainer);
                document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;

                conversationHistory.push(`Your response: ${botResponse}`);
                localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
            })
            .catch(error => {
                console.error('Error fetching from API:', error);
                typingIndicator.remove();
                alert("Hey, I can't reply you here right now, can you send me email on eleonardodev@gmail.com instead?")
            });
    }
}

window.addEventListener('beforeunload', function() {
    localStorage.removeItem('conversationHistory');
});

function formatBotResponse(response) {
    let sentences = response.split(/(?<!\d\s?)\.\s/);

    let formattedResponse = sentences.map((sentence, index) => {
        if ((index + 1) % 3 === 0) {
            return sentence + '.<br><br>';
        }
        return sentence + '. ';
    }).join('');
    return response;
}





