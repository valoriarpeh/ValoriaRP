let currentUser = null;
let currentTicket = null;
let ticketNumber = null;

// Webhook Discord (à créer dans Discord)
const WEBHOOK_URL = "VOTRE_WEBHOOK_URL_ICI";
const BOT_API_URL = "https://VOTRE_BOT_ECLOUD.com/api"; // URL de ton bot sur ecloud

document.getElementById('connect-btn').addEventListener('click', connectUser);
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

// Récupérer le ticket depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const ticketParam = urlParams.get('ticket');
if (ticketParam) {
    ticketNumber = ticketParam;
}

function connectUser() {
    const username = document.getElementById('username-input').value.trim();
    if (!username) {
        alert('Veuillez entrer un pseudo.');
        return;
    }

    currentUser = username;
    
    if (ticketNumber) {
        currentTicket = `request-${String(ticketNumber).padStart(3, '0')}`;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('chat-screen').style.display = 'block';
        document.getElementById('user-info').textContent = `👤 ${username} (${currentTicket})`;
        document.getElementById('ticket-info').textContent = `🎫 ${currentTicket}`;
        loadMessages();
        setInterval(loadMessages, 3000);
        return;
    }
    
    // Créer un nouveau ticket
    fetch(`${BOT_API_URL}/create_ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username })
    })
    .then(res => res.json())
    .then(data => {
        currentTicket = data.ticket_id;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('chat-screen').style.display = 'block';
        document.getElementById('user-info').textContent = `👤 ${username} (${currentTicket})`;
        document.getElementById('ticket-info').textContent = `🎫 ${currentTicket}`;
        loadMessages();
        setInterval(loadMessages, 3000);
    })
    .catch(err => {
        console.error('Erreur:', err);
        alert('Erreur lors de la création du ticket.');
    });
}

function loadMessages() {
    fetch(`${BOT_API_URL}/messages/${currentTicket}`)
    .then(res => res.json())
    .then(data => {
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = '';
        data.forEach(msg => {
            addMessage(msg);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}

function addMessage(msg) {
    const messagesContainer = document.getElementById('messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message';
    
    if (msg.is_system) {
        msgDiv.classList.add('system');
        msgDiv.innerHTML = `<div class="system-msg">${msg.message}</div>`;
    } else {
        const isOwn = msg.username === currentUser;
        if (isOwn) msgDiv.classList.add('own');
        
        msgDiv.innerHTML = `
            <div class="message-avatar">
                <img src="${msg.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + msg.username}" alt="avatar">
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="username">${msg.username}</span>
                    <span class="timestamp">${new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="message-text">${msg.message}</div>
            </div>
        `;
    }
    
    messagesContainer.appendChild(msgDiv);
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message || !currentUser || !currentTicket) return;
    
    input.value = '';
    input.disabled = true;
    document.getElementById('send-btn').disabled = true;
    
    // Envoyer via le bot
    fetch(`${BOT_API_URL}/send_message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ticket_id: currentTicket,
            username: currentUser,
            message: message,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser}`
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            addMessage({
                username: currentUser,
                message: message,
                timestamp: new Date().toISOString(),
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser}`
            });
            const messagesContainer = document.getElementById('messages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        input.disabled = false;
        document.getElementById('send-btn').disabled = false;
    })
    .catch(err => {
        console.error('Erreur:', err);
        input.disabled = false;
        document.getElementById('send-btn').disabled = false;
    });
}
