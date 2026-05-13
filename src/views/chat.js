import { escapeHtml, formatMessagesForGemini, parseGeminiResponse } from "./../transform/utils.js";

const state = {
    messages: [
        {
            role: "character",
            text: "Soy Walter White. Algunos me llaman Heisenberg. ¿En qué puedo... orientarte?",
        },
    ],
    status: "idle", // idle | loading | error
    error: null,
};

export function renderChat() {
    const $app = document.querySelector("#app");

    $app.innerHTML = `
    <div class="chatApp">
      <header class="chatHeader">
        <h1 class="chatHeader__title">Chat con Walter White</h1>
        <p class="chatHeader__subtitle">Habla con Heisenberg. Tread lightly.</p>
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
          ${state.status === "loading" ? "disabled" : ""}
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
        .map(
            (msg) =>
                `<div class="message message--${msg.role}">${escapeHtml(msg.text)}</div>`
        )
        .join("");
}

function renderStatus() {
    if (state.status === "loading") {
        return `<div class="message message--character message--typing">Escribiendo...</div>`;
    }
    if (state.status === "error") {
        return `<div class="message message--error">${escapeHtml(state.error)}</div>`;
    }
    return "";
}

function setState(updates) {
    Object.assign(state, updates);
    renderChat();
}

function setupChat() {
    const $form = document.querySelector("#chatComposer");
    const $input = document.querySelector("#chatInput");

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
            const reply = await getCharacterReply(state.messages);
            setState({
                messages: [...state.messages, { role: "character", text: reply }],
                status: "idle",
                error: null,
            });
        } catch (err) {
            setState({
                status: "error",
                error: "No se pudo obtener respuesta. Intenta de nuevo.",
            });
        }

        document.querySelector("#chatInput")?.focus();
    });

    $input.focus();
}

function scrollToBottom() {
    const $messages = document.querySelector("#chatMessages");
    if ($messages) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}

/**
 * Llama a la serverless function que hace de proxy a Gemini.
 * @param {Array<{role: string, text: string}>} messages - historial completo
 * @returns {Promise<string>} texto de respuesta del personaje
 */
async function getCharacterReply(messages) {
    const formattedMessages = formatMessagesForGemini(messages);

    const response = await fetch("/api/functions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formattedMessages }),
    });

    if (response.status === 429) {
        return "Estoy... ocupado en este momento. Mis recursos tienen límites, igual que la paciencia. Volvé más tarde.";
    }

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
}