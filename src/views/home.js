export function renderHome() {
    const app = document.querySelector("#app");
    app.innerHTML = `
    <section class="view view--home">
      <h1>Chatea con Walter White</h1>
      <p>
        Ex profesor de química. Genio. Heisenberg.
        Tenés una pregunta, él tiene la respuesta.
        Pero cuidado con cómo le hablás.
      </p>
      <p>
        Impulsado por Google Gemini AI. El historial se mantiene durante la sesión.
      </p>
      <a class="btn btn--primary" href="/chat">Comenzar a chatear</a>
    </section>
    `;
}