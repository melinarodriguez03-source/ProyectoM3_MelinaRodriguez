import { describe, it, expect, vi, beforeEach } from "vitest";
import { escapeHtml, formatMessagesForGemini, parseGeminiResponse, formatTime } from "../src/utils.js";

// ─── escapeHtml ───────────────────────────────────────────────────────────────

describe("escapeHtml", () => {
    it("escapa caracteres especiales HTML", () => {
        expect(escapeHtml("<script>alert('xss')</script>")).toBe(
            "&lt;script&gt;alert('xss')&lt;/script&gt;"
        );
    });

    it("escapa ampersands", () => {
        expect(escapeHtml("sal & pimienta")).toBe("sal &amp; pimienta");
    });

    it("devuelve el mismo texto si no hay caracteres especiales", () => {
        expect(escapeHtml("Hola Walter")).toBe("Hola Walter");
    });

    it("maneja string vacío", () => {
        expect(escapeHtml("")).toBe("");
    });
});

// ─── formatMessagesForGemini ──────────────────────────────────────────────────

describe("formatMessagesForGemini", () => {
    it("convierte rol 'user' correctamente", () => {
        const messages = [{ role: "user", text: "Hola" }];
        const result = formatMessagesForGemini(messages);
        expect(result[0].role).toBe("user");
        expect(result[0].parts[0].text).toBe("Hola");
    });

    it("convierte rol 'character' a 'model'", () => {
        const messages = [{ role: "character", text: "Soy Heisenberg." }];
        const result = formatMessagesForGemini(messages);
        expect(result[0].role).toBe("model");
    });

    it("mantiene el historial completo en orden", () => {
        const messages = [
            { role: "character", text: "Hola" },
            { role: "user", text: "¿Quién eres?" },
            { role: "character", text: "Soy el peligro." },
        ];
        const result = formatMessagesForGemini(messages);
        expect(result).toHaveLength(3);
        expect(result[0].role).toBe("model");
        expect(result[1].role).toBe("user");
        expect(result[2].role).toBe("model");
    });

    it("devuelve array vacío si no hay mensajes", () => {
        expect(formatMessagesForGemini([])).toEqual([]);
    });
});

// ─── parseGeminiResponse ──────────────────────────────────────────────────────

describe("parseGeminiResponse", () => {
    it("extrae el texto de una respuesta válida de Gemini", () => {
        const mockResponse = {
            candidates: [
                {
                    content: {
                        parts: [{ text: "  Di mi nombre.  " }],
                    },
                },
            ],
        };
        expect(parseGeminiResponse(mockResponse)).toBe("Di mi nombre.");
    });

    it("lanza error si la respuesta no tiene la estructura esperada", () => {
        expect(() => parseGeminiResponse({})).toThrow(
            "No se pudo parsear la respuesta de la IA."
        );
    });

    it("lanza error si candidates está vacío", () => {
        expect(() => parseGeminiResponse({ candidates: [] })).toThrow();
    });
});

// ─── formatTime ───────────────────────────────────────────────────────────────

describe("formatTime", () => {
    it("devuelve un string con formato HH:MM", () => {
        const result = formatTime(new Date("2024-01-01T15:30:00"));
        expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it("usa la fecha actual si no se pasa argumento", () => {
        const result = formatTime();
        expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
});