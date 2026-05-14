# Chat con Walter White 🧪

Una Single Page Application que permite chatear con **Walter White** (Breaking Bad) usando Google Gemini AI, con una Vercel Serverless Function como proxy seguro para la API key.

---

## Personaje elegido

**Walter White / Heisenberg** — *Breaking Bad*

Ex profesor de química de Albuquerque que se convirtió en el mayor productor de metanfetamina azul de Estados Unidos. Inteligente, orgulloso y calculador. Su personalidad compleja y sus frases icónicas lo hacen ideal para una experiencia conversacional única.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`
- Una API key de [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## Ejecutar localmente

1. Cloná el repositorio:
   ```bash
   git clone <url-del-repo>
   cd chat-walter-white
   ```

2. Instalá las dependencias:
   ```bash
   npm install
   ```

3. Configurá las variables de entorno:
   ```bash
   cp .env.example .env
   # Editá .env y agregá tu GEMINI_API_KEY
   ```

4. Iniciá el servidor de desarrollo (necesario para que funcionen las serverless functions):
   ```bash
   vercel dev
   ```

5. Abrí `http://localhost:3000` en tu navegador.

---

## Ejecutar tests

```bash
npm test
```

Los tests se encuentran en `/tests` y cubren:
- `escapeHtml` — prevención de XSS
- `formatMessagesForGemini` — transformación del historial al formato de Gemini
- `parseGeminiResponse` — parseo de respuestas de la API
- `formatTime` — formateo de timestamps
- `router` — navegación entre vistas
- `navigateTo` — cambio de URL sin recarga

---

## Desplegar en Vercel

1. Subí el proyecto a GitHub.
2. Importá el repositorio en [vercel.com](https://vercel.com).
3. En el dashboard de Vercel, agregá la variable de entorno:
   - `GEMINI_API_KEY` = tu API key real
4. Desplegá. Vercel detecta automáticamente la serverless function en `/api/functions.js`.

---

## Capturas de pantalla de app funcionando en PC
![Home Page Pc](img/Home%20en%20Pc.jpg.png)
![Chat Page Pc](img/Chat%20en%20pc.jpg.png)

## Capturas de pantalla de app funcionando en Mobile
![Home Page Mobile](img/Home%20en%20mobile.jpg.png)
![Chat Page Mobile](img/Chat%20en%20mobile.jpg.png)

---

## Link a la aplicación desplegada

> (https://proyecto-m3-melina-rodriguez.vercel.app/)

---

## Registro del uso de IA

Durante el desarrollo se utilizó Claude (Anthropic) como herramienta de apoyo para:
- Detectar y corregir bugs en el código (llave mal ubicada en `navigation.js`, `>` faltante en el form).
- Generar el system prompt de Walter White para Gemini.
- Estructurar `utils.js`, `api/functions.js` y los tests unitarios.
- Revisar el CSS y corregir errores de tipeo (`min-widht`, selectores sin punto).

Las sugerencias fueron evaluadas y adaptadas al código existente antes de incorporarlas.