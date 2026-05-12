const state = {
    messages: [
        {role: "character", text: "Hola, soy tu personaje favorito. ¿En qué puedo ayudarte?"},

    ],
    status: "idle", // idle, loading, error
    error: null,
};

export function renderChat() {
    const $app = document.querySelector('#app');

    $app.innerHTML = `
    <div class="chatApp">
    <header class="chatHeader">
        <h1 class="chatHeader__title">Chat</h1>
        <p class="chatHeader__subtitle">Con tu personaje favorito</p>
    </header>

    <main class="chatMessages" id="chatMessages" aria-live="polite">
    ${renderMessages()}
    ${renderStatus()}
    </main>

    <form class="chatComposer" id="chatComposer">
     <input
        class="chatComposer__input"
        id="chatInput"
        type="text"
        placeholder="Escribe tu mensaje..."
        aria-label="Escribe tu mensaje"
        ${state.status === "loading" ? "disabled" : "" }
        />
        <button class="chatComposer__send" type="submit" ${state.status === "loading" ? "disabled" : ""}>
            Enviar
        </button>
    </form>
   </div>
    `;

    setupChat();
    scrollToBottom();
}

function renderMessages() {
    return state.messages
    .map((msg) => ` <div class="message message--${msg.role}">${escapeHtml(msg.text)}</div>
        ` ).join("");
}

function renderStatus() {
    if (state.status === "loading") {
        return `<div class="message message--character message--typing">Escribiendo...</div>`;
    }
    if (state.status === "error") {
        return `<div class="message message--error">${state.error}
      </div>`;
    }
    return "";
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function setState(updates) {
    Object.assign(state, updates);
    renderChat();
}

function setupChat() {
    const $form = document.querySelector('#chatComposer');
    const $input = document.querySelector('#chatInput');

    $form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const text = $input.value.trim();
        if (!text) return;

        const userMessage = { role: "user", text };
        setState({
            messages: [...state.messages, userMessage],
            status: "loading",
            error: null,
        });
    
        try {
            const reply = await getCharacterReply(text);
            setState({
                messages: [...state.messages, { role: "character", text: reply }],
                status: "idle",
                error: null,
            });
            
        } catch (err) {
            setState({
                status: "error",
                error: "Error al obtener la respuesta del personaje."
            });
        }

        document.querySelector("#chatInput")?.focus();
    });
    
    $input.focus();
}

function scrollToBottom() {
    const $messages = document.querySelector('#chatMessages');
    if ($messages) {
        $messages.scrollTop = $messages.scrollHeight;
    }           
}

function getCharacterReply(userText) {
    return new Promise((resolve,reject) => {
        const delay = 800 + Math.random() * 1200;
        setTimeout(() => {

            if (Math.random() < 0.25) {
                reject (new Error("Simulated API error"));
                return;
            }

            resolve(`Recibido:"${userText}". Esta respuesta es simulada`);
        }, delay);
    });
}