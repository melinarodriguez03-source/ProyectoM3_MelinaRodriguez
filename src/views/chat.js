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

    <form class="chatComposer" id="chatComposer"
     <input
        class="chatComposer__input"
        id="chatInput"
        type="text"
        placeholder="Escribe tu mensaje..."
        aria-label="Escribe tu mensaje" />
        $state.status === "loading" ? "disabled" : ""
        />
        <button class="chatComposer__Send" type="submit" ${state.status === "loading" ? "disabled" : ""}>
            Enviar
        </button>
    </form>
   </div>
    `;

    setupChat();
    scrollToBottom();
}