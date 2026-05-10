export function renderNotFound() {
    const app = document.querySelector('#app');
    app.innerHTML = `
    <section class="view view--notFound">
    <h1>404 - Página no encontrada</h1>
    <p>Lo sentimos, la página que buscas no existe.</p>
    <a class="btn btn--primary" href="/">Volver al inicio</a>
    </section>
    `;  
}