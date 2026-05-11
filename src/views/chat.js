export function renderChat() {
    const app = document.querySelector('#app');
    app.innerHTML = `
    <div class="chatApp">
    <header class="chatHeader">
        <h1 class="chatHeader__title">Chat</h1>
        <p class="chatHeader__subtitle">Con tu personaje favorito</p>
    </header>

    <main class="chatMessages" aria-label="Mensajes">
          <div class="message message--character">Hola, en qué puedo ayudarte?</div>
          <div class="message message--user">Hola, estoy aprendiendo programación y me siento medio perdido con tantas tecnologías. ¿Por dónde empiezo?.</div>  
          <div class="message message--character">Lo más importante al empezar no es aprender “todo”, sino entender la lógica. Si podés resolver problemas simples paso a paso, después cambiar de lenguaje es mucho más fácil.</div>
          <div class="message message--user">¿Entonces no importa tanto el lenguaje?</div>
          <div class="message message--character">Importa, pero menos de lo que parece. La mayoría comparte conceptos parecidos: variables, funciones, condiciones, estructuras de datos. Lo importante es practicar pensando como programador.</div>
          <div class="message message--user">¿Y cómo se piensa como programador?</div>
          <div class="message message--character">Dividiendo problemas grandes en partes pequeñas.</div>
          <div class="message message--user">Creo que mi problema es que miro tutoriales pero después no puedo hacer nada solo.</div>
          <div class="message message--character">Eso es súper común. Ver tutoriales da una falsa sensación de entender. El aprendizaje real empieza cuando intentás hacer algo sin copiar.</div>
          
    </main>
    <form class="chatComposer">
     <input
        class="chatComposer__input"
        type="text"
        placeholder="Escribe tu mensaje..."
        aria-label="Escribe tu mensaje" />
        <button class="chatComposer__send" type="submit">Enviar</button>
    </form>
   </div>
    `;
}