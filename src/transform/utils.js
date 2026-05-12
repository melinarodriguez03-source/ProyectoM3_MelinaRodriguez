/**
 * Escapa caracteres HTML para prevenir XSS.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Transforma el historial interno al formato que espera Gemini.
 * Gemini usa roles "user" y "model".
 * @param {Array<{role: string, text: string}>} messages
 * @returns {Array<{role: string, parts: [{text: string}]}>}
 */
export function formatMessagesForGemini(messages) {
    return messages
        .filter((msg) => msg.role === "user" || msg.role === "character")
        .map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
        }));
}

/**
 * Parsea la respuesta de Gemini y extrae el texto.
 * @param {object} data - JSON de respuesta de Gemini
 * @returns {string}
 */
export function parseGeminiResponse(data) {
    try {
        return data.candidates[0].content.parts[0].text.trim();
    } catch {
        throw new Error("No se pudo parsear la respuesta de la IA.");
    }
}

/**
 * Formatea una fecha como HH:MM.
 * @param {Date} date
 * @returns {string}
 */
export function formatTime(date = new Date()) {
    return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}