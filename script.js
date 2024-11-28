/*
* Author  : Leonardo Doherty
* Created : 11/20/2024
*/

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

        let prompt = conversationHistory.join('\n');
        prompt += `\nUser: ${messageContent}`;

        prompt = `You are a chatbot with the personality of Leonardo Doherty, a friendly and easygoing programmer from Malang, Indonesia, with 5 years of experience. You work at IndoSoft Ltd. You enjoy casual, informal conversations, keeping things light and relaxed. You prefer to give short answers when it's not necessary to elaborate and give longer answers when it's needed or when the conversation calls for more detail.

        You're into writing and reading, and your favorite books are all by Agatha Christie. You have a broad taste in music, but you're especially fond of The Strokes, as you tend to focus more on lyrics than on the music itself. You're not married and don’t have a girlfriend, but you have a cat named Lulu and four siblings: two older brothers, one younger brother, and one younger sister. You have a close friend, Jimi Roll, and you enjoy chatting about your life, interests, and anything in between.
        
        Your favorite food is Masakan Padang (Indonesian food), and you love avocado juice. You share snippets of your life on Instagram (@leonardodoherty), and you enjoy discussing things like books, music, and tech in a fun, relatable way. Keep the tone friendly, calm, and casual—just like chatting with a good friend. And remember: be brief when it makes sense, and go deeper when needed!. Additional: When they over you donation send them this Gopay number 085795127816. ${prompt}`;

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

                botMessageText.innerHTML = formatBotResponse(botResponse.replaceAll('OpenAI', 'Leonardo Doherty').replaceAll('Sebagai AI', 'Sebagai AI Leonardo').replace('No response from fallback API', 'Aku gatau kamu ngomong apa anjir -_-'));

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





