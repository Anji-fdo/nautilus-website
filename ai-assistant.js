/* ─────────────────────────────────────────────────────
   Nautilus Code — AI Assistant Widget

───────────────────────────────────────────────────── */

(function () {

  /* ══════════════════════════════════════════════════
     YOUR BUSINESS INFO — edit this section
  ══════════════════════════════════════════════════ */
  const BUSINESS_CONTEXT = `
You are the AI assistant for Nautilus Code, a software development company based in Sri Lanka.
You help website visitors learn about Nautilus Code's services and guide them toward booking a consultation.

ABOUT NAUTILUS CODE:
- We build custom business software, automation systems, POS platforms, and web applications.
- We reduce client overhead by up to 40% through intelligent automation.
- We have delivered 130+ projects and work with growing enterprises across Sri Lanka and internationally.
- Contact: WhatsApp +94713441221 | Email: hello@nautiluscode.lk

SERVICES:
- Custom Web Applications & Platforms
- POS & Inventory Management Systems
- Business Process Automation
- E-commerce Solutions (Retail & Commerce)
- Tourism & Hospitality Systems
- Finance & Fintech Platforms
- Healthcare Management Systems
- Education Platforms
- Startup & SaaS Development

FREQUENTLY ASKED QUESTIONS:
Q: How long does a project take?
A: Typical projects take 1-4 weeks depending on complexity. We provide a detailed timeline after the initial consultation.

Q: What is your pricing?
A: Projects are quoted based on scope. Most small business systems start from LKR 35000. Contact us for a free quote.

Q: Do you work with startups?
A: Yes! We have a dedicated Startups & SaaS track with flexible payment options.

Q: Where are you based?
A: We are based in Sri Lanka and work with clients globally.

Q: How do I get started?
A: Click "Let's Talk" or WhatsApp us at +94713441221 to book a free 15-minute consultation.

Q: Do you provide ongoing support?
A: Yes, all our projects include free 1 month post-launch support, with optional maintenance packages.

TONE: Be friendly, professional, and concise. Always end responses by offering to connect the user with the team if they need more details. Never make up information not listed above.
`;

  const SUGGESTED_QUESTIONS = [
    "What services do you offer?",
    "How much does a project cost?",
    "How long does development take?",
    "How do I get started?"
  ];

  const ASSISTANT_NAME  = "Nautilus AI";
  const ASSISTANT_TITLE = "Nautilus Code Assistant";
  const BRAND_COLOR     = "#2563eb";
  const BRAND_DARK      = "#0d1b3e";

  /* ══════════════════════════════════════════════════
     INJECT STYLES
  ══════════════════════════════════════════════════ */
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

    #nc-ai-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 54px;
      height: 54px;
      background: ${BRAND_COLOR};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 4px 20px rgba(37,99,235,0.4);
      border: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #nc-ai-fab:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(37,99,235,0.5);
    }
    #nc-ai-fab .nc-fab-icon { display: flex; }
    #nc-ai-fab .nc-fab-close { display: none; }
    #nc-ai-fab.open .nc-fab-icon { display: none; }
    #nc-ai-fab.open .nc-fab-close { display: flex; }

    #nc-ai-unread {
      position: absolute;
      top: -3px;
      right: -3px;
      width: 16px;
      height: 16px;
      background: #16d513;
      border-radius: 50%;
      border: 2px solid #fff;
      display: none;
    }
    #nc-ai-unread.show { display: block; }

    #nc-ai-panel {
      position: fixed;
      bottom: 94px;
      right: 28px;
      width: 360px;
      max-height: 560px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(13,27,62,0.14);
      display: flex;
      flex-direction: column;
      z-index: 9999;
      font-family: 'DM Sans', sans-serif;
      overflow: hidden;
      opacity: 0;
      transform: translateY(12px) scale(0.97);
      pointer-events: none;
      transition: opacity 0.22s ease, transform 0.22s ease;
    }
    #nc-ai-panel.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    .nc-ai-header {
      background: ${BRAND_DARK};
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .nc-ai-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: ${BRAND_COLOR};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .nc-ai-header-text { flex: 1; }
    .nc-ai-name  { font-size: 0.88rem; font-weight: 600; color: #fff; }
    .nc-ai-title { font-size: 0.72rem; color: rgba(255,255,255,0.55); margin-top: 1px; }
    .nc-ai-status {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.68rem;
      color: rgba(255,255,255,0.5);
    }
    .nc-ai-online-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #22c55e;
    }

    .nc-ai-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 340px;
      scrollbar-width: thin;
      scrollbar-color: rgba(13,27,62,0.1) transparent;
    }

    .nc-msg {
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }
    .nc-msg.user { flex-direction: row-reverse; }

    .nc-msg-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${BRAND_COLOR};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 600;
      color: #fff;
    }
    .nc-msg.user .nc-msg-avatar {
      background: rgba(13,27,62,0.08);
      color: ${BRAND_DARK};
    }

    .nc-msg-bubble {
      max-width: 78%;
      padding: 10px 13px;
      border-radius: 14px;
      font-size: 0.83rem;
      line-height: 1.55;
    }
    .nc-msg.bot .nc-msg-bubble {
      background: #f1f4f9;
      color: #1e2a45;
      border-bottom-left-radius: 4px;
    }
    .nc-msg.user .nc-msg-bubble {
      background: ${BRAND_COLOR};
      color: #fff;
      border-bottom-right-radius: 4px;
    }

    .nc-msg-time {
      font-size: 0.65rem;
      color: rgba(13,27,62,0.35);
      margin-top: 3px;
      padding: 0 4px;
    }
    .nc-msg.user .nc-msg-time { text-align: right; }

    .nc-typing {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .nc-typing-dots {
      display: flex;
      gap: 4px;
      padding: 10px 13px;
      background: #f1f4f9;
      border-radius: 14px;
      border-bottom-left-radius: 4px;
    }
    .nc-typing-dots span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(13,27,62,0.3);
      animation: ncDot 1.2s infinite;
    }
    .nc-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .nc-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes ncDot {
      0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }

    .nc-ai-suggestions {
      padding: 0 16px 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .nc-suggestion {
      font-size: 0.75rem;
      font-weight: 400;
      color: ${BRAND_COLOR};
      background: rgba(37,99,235,0.07);
      border: 1px solid rgba(37,99,235,0.18);
      border-radius: 100px;
      padding: 5px 12px;
      cursor: pointer;
      transition: background 0.15s;
      font-family: 'DM Sans', sans-serif;
      white-space: nowrap;
    }
    .nc-suggestion:hover { background: rgba(37,99,235,0.14); }

    .nc-ai-input-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      border-top: 1px solid rgba(13,27,62,0.07);
    }
    #nc-ai-input {
      flex: 1;
      border: 1px solid rgba(13,27,62,0.12);
      border-radius: 10px;
      padding: 9px 13px;
      font-size: 0.83rem;
      font-family: 'DM Sans', sans-serif;
      color: ${BRAND_DARK};
      outline: none;
      background: #f7f8fc;
      transition: border-color 0.2s;
      resize: none;
    }
    #nc-ai-input:focus { border-color: ${BRAND_COLOR}; background: #fff; }
    #nc-ai-input::placeholder { color: rgba(13,27,62,0.35); }

    #nc-ai-send {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: ${BRAND_COLOR};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    #nc-ai-send:hover { background: #1d4ed8; }
    #nc-ai-send:disabled { background: rgba(37,99,235,0.35); cursor: not-allowed; }

    @media (max-width: 420px) {
      #nc-ai-panel {
        right: 12px;
        left: 12px;
        width: auto;
        bottom: 86px;
      }
      #nc-ai-fab { right: 16px; bottom: 16px; }
    }
  `;
  document.head.appendChild(style);

  /* ══════════════════════════════════════════════════
     BUILD HTML
  ══════════════════════════════════════════════════ */
  function nowTime() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  const panel = document.createElement('div');
  panel.id = 'nc-ai-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Nautilus Code AI Assistant');
  panel.innerHTML = `
    <div class="nc-ai-header">
      <div class="nc-ai-avatar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="white" stroke-width="1.8"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="nc-ai-header-text">
        <div class="nc-ai-name">${ASSISTANT_NAME}</div>
        <div class="nc-ai-title">${ASSISTANT_TITLE}</div>
      </div>
      <div class="nc-ai-status">
        <span class="nc-ai-online-dot"></span>
        Online
      </div>
    </div>

    <div class="nc-ai-messages" id="nc-ai-messages"></div>

    <div class="nc-ai-suggestions" id="nc-ai-suggestions"></div>

    <div class="nc-ai-input-row">
      <input id="nc-ai-input" type="text" placeholder="Ask me anything..." maxlength="300" autocomplete="off" />
      <button id="nc-ai-send" aria-label="Send">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;

  const fab = document.createElement('button');
  fab.id = 'nc-ai-fab';
  fab.setAttribute('aria-label', 'Open AI Assistant');
  fab.innerHTML = `
    <div class="nc-fab-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="nc-fab-close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <span id="nc-ai-unread"></span>
  `;

  document.body.appendChild(panel);
  document.body.appendChild(fab);

  /* ══════════════════════════════════════════════════
     CHAT LOGIC
  ══════════════════════════════════════════════════ */
  const messagesEl   = document.getElementById('nc-ai-messages');
  const inputEl      = document.getElementById('nc-ai-input');
  const sendBtn      = document.getElementById('nc-ai-send');
  const suggestionsEl= document.getElementById('nc-ai-suggestions');
  const unreadBadge  = document.getElementById('nc-ai-unread');
  const GROQ_API_KEY = window._groqKey || '';

  let isOpen        = false;
  let isLoading     = false;
  let history       = [];
  let greeted       = false;
  let typingEl      = null;

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addMessage(role, text) {
    const wrapper = document.createElement('div');
    wrapper.className = `nc-msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'nc-msg-avatar';
    avatar.textContent = role === 'bot' ? 'N' : 'You';

    const col = document.createElement('div');

    const bubble = document.createElement('div');
    bubble.className = 'nc-msg-bubble';
    bubble.textContent = text;

    const time = document.createElement('div');
    time.className = 'nc-msg-time';
    time.textContent = nowTime();

    col.appendChild(bubble);
    col.appendChild(time);

    if (role === 'bot') {
      wrapper.appendChild(avatar);
      wrapper.appendChild(col);
    } else {
      wrapper.appendChild(col);
      wrapper.appendChild(avatar);
    }

    messagesEl.appendChild(wrapper);
    scrollToBottom();
    return bubble;
  }

  function showTyping() {
    typingEl = document.createElement('div');
    typingEl.className = 'nc-typing';
    const avatar = document.createElement('div');
    avatar.className = 'nc-msg-avatar';
    avatar.textContent = 'N';
    const dots = document.createElement('div');
    dots.className = 'nc-typing-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';
    typingEl.appendChild(avatar);
    typingEl.appendChild(dots);
    messagesEl.appendChild(typingEl);
    scrollToBottom();
  }

  function hideTyping() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
  }

  function buildSuggestions(questions) {
    suggestionsEl.innerHTML = '';
    questions.forEach(function (q) {
      const btn = document.createElement('button');
      btn.className = 'nc-suggestion';
      btn.textContent = q;
      btn.addEventListener('click', function () {
        sendMessage(q);
      });
      suggestionsEl.appendChild(btn);
    });
  }

  async function sendMessage(text) {
    if (isLoading || !text.trim()) return;

    const userText = text.trim();
    inputEl.value  = '';
    suggestionsEl.innerHTML = '';

    addMessage('user', userText);
    history.push({ role: 'user', content: userText });

    isLoading = true;
    sendBtn.disabled = true;
    showTyping();

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + GROQ_API_KEY
            },
            body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            max_tokens: 1000,
            messages: [
                { role: 'system', content: BUSINESS_CONTEXT },
                ...history
            ]
            })
        });

     const data = await response.json();
        hideTyping();

        const reply = data.choices && data.choices[0]
        ? data.choices[0].message.content
        : "Sorry, please WhatsApp us at +94713441221.";

      addMessage('bot', reply);
      history.push({ role: 'assistant', content: reply });

      // Show follow-up suggestions after first exchange
      if (history.length <= 4) {
        buildSuggestions(["Tell me more", "How do I get started?", "What's the pricing?"]);
      }

    } catch (err) {
      hideTyping();
      addMessage('bot', "I'm having trouble connecting right now. Please reach out on WhatsApp: +94713441221 — we'll respond within minutes.");
    }

    isLoading = false;
    sendBtn.disabled = false;
    inputEl.focus();
  }

  function greet() {
    if (greeted) return;
    greeted = true;
    setTimeout(function () {
      addMessage('bot', "Hi there! I'm the Nautilus Code AI assistant. I can answer questions about our services, pricing, and timelines. How can I help you today?");
      buildSuggestions(SUGGESTED_QUESTIONS);
    }, 300);
  }

  /* ══════════════════════════════════════════════════
     EVENTS
  ══════════════════════════════════════════════════ */
  fab.addEventListener('click', function () {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    fab.classList.toggle('open', isOpen);
    unreadBadge.classList.remove('show');
    if (isOpen) {
      greet();
      setTimeout(function () { inputEl.focus(); }, 250);
    }
  });

  sendBtn.addEventListener('click', function () {
    sendMessage(inputEl.value);
  });

  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputEl.value);
    }
  });

  // Show unread badge after 4s if widget not opened
  setTimeout(function () {
    if (!isOpen) { unreadBadge.classList.add('show'); }
  }, 4000);

})();