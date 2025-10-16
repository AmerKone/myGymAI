const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function addMessage(content, sender) {
  const message = document.createElement('div');
  message.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');

  const avatar = document.createElement('img');
  avatar.classList.add('avatar');
  avatar.src = sender === 'user' ? '/static/user_gym.svg' : '/static/bot_gym.svg';
  avatar.alt = sender === 'user' ? 'You' : 'Bot';

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  // Render markdown-like responses into structured HTML
  bubble.innerHTML = renderMarkdown(content);

  message.appendChild(avatar);
  message.appendChild(bubble);

  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Create a bot message bubble with a typing indicator and return the bubble element
function createBotBubble() {
  const message = document.createElement('div');
  message.classList.add('message', 'bot-message');

  const avatar = document.createElement('img');
  avatar.classList.add('avatar');
  avatar.src = '/static/bot_gym.svg';
  avatar.alt = 'Bot';

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.innerHTML = '<span class="typing-indicator">• • •</span>';

  message.appendChild(avatar);
  message.appendChild(bubble);

  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;

  return bubble;
}

// Type out plain text into the bubble character-by-character, then render Markdown at the end
function typeOut(bubble, text, speed = 15) {
  if (!bubble) return;
  // show plain text while typing (avoid HTML partials)
  bubble.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    i++;
    bubble.textContent = text.slice(0, i);
    chatBox.scrollTop = chatBox.scrollHeight;
    if (i >= text.length) {
      clearInterval(timer);
      // If marked+DOMPurify are available, render as Markdown then sanitize
      if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
        try {
          const rendered = marked.parse(String(text));
          bubble.innerHTML = DOMPurify.sanitize(rendered);
        } catch (e) {
          bubble.innerHTML = escapeHtml(String(text));
        }
      } else {
        // fallback to local renderer
        bubble.innerHTML = renderMarkdown(text);
      }
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, speed);
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  userInput.value = '';

  const response = await fetch('/get', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text })
  });

  // Support both JSON responses {reply: ...} and plain text responses
  let replyText = '';
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await response.json();
    replyText = data.reply || data.answer || JSON.stringify(data);
  } else {
    replyText = await response.text();
  }
  // Create a bot bubble with typing indicator and then type out the reply
  const botBubble = createBotBubble();
  // speed in ms per character (tune as desired)
  typeOut(botBubble, replyText, 12);
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

window.addEventListener('load', () => {
  addMessage('🏋️‍♂️ Hello! I’m your Gym AI Assistant. Ask me about training, schedules, or fitness tips!', 'bot');
});


// Lightweight markdown renderer for the chat bubble. Supports headings (#), bold (**text**),
// italics (*text*), unordered lists (- item), ordered lists (1. item), paragraphs and code blocks (```).
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderMarkdown(text) {
  if (!text) return '';
  // Normalize line endings
  text = text.replace(/\r\n/g, '\n');

  // Handle code blocks ```
  text = text.replace(/```([\s\S]*?)```/g, function(_, code) {
    return '<pre><code>' + escapeHtml(code) + '</code></pre>';
  });

  // Escape remaining text before adding inline formatting
  text = escapeHtml(text);

  // Headings
  text = text.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  text = text.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  text = text.replace(/^# (.*)$/gm, '<h1>$1</h1>');

  // Bold and italics
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Unordered lists: convert lines starting with - into <li>
  text = text.replace(/(^|\n)- (.*?)(?=\n|$)/g, function(_, prefix, item) {
    return prefix + '<li>' + item + '</li>';
  });
  // Wrap consecutive <li> into <ul>
  text = text.replace(/(<li>[\s\S]*?<\/li>)(?:(\n)?<li>)/g, function(m) { return m; });
  text = text.replace(/(?:<li>[\s\S]*?<\/li>\n?)+/g, function(m) {
    if (m.indexOf('<li>') !== -1) return '<ul>' + m.replace(/\n/g, '') + '</ul>';
    return m;
  });

  // Ordered lists (very simple: lines starting with digits + .)
  text = text.replace(/(^|\n)\d+\. (.*?)(?=\n|$)/g, function(_, prefix, item) {
    return prefix + '<li>' + item + '</li>';
  });
  text = text.replace(/(?:<li>[\s\S]*?<\/li>\n?)+/g, function(m) {
    // if it's already wrapped in <ul>, don't change
    if (m.trim().startsWith('<ul>')) return m;
    if (m.indexOf('<li>') !== -1) return '<ol>' + m.replace(/\n/g, '') + '</ol>';
    return m;
  });

  // Convert remaining double-newlines to paragraphs
  const paragraphs = text.split(/\n{2,}/).map(p => p.replace(/\n/g, '<br/>'));
  return paragraphs.map(p => '<div>' + p + '</div>').join('');
}
