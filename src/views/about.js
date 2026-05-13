export function renderAbout() {
    const app = document.querySelector("#app");
    app.innerHTML = `
    <section class="view--about">
      <div class="about__card">
        <h1>Sobre este proyecto</h1>
        <p>
          Una prueba de concepto (POC) desarrollada para <strong>ComicSansCon</strong>,
          una agencia digital especializada en experiencias interactivas para fans.
        </p>
        <p>
          El personaje elegido es <strong>Walter White</strong> (Breaking Bad).
          Un hombre de ciencia que se convirtió en leyenda.
          Su personalidad compleja — inteligente, orgullosa y calculadora — 
          lo hace ideal para una experiencia conversacional única.
        </p>
        <p>
          <strong>Stack:</strong> HTML, CSS, JavaScript vanilla, Google Gemini AI, Vercel Serverless Functions.
        </p>
        <a class="btn btn--primary" href="/chat">Ir al chat</a>
      </div>
    </section>
    `;
}