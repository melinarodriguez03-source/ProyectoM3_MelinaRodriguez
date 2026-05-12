import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `Eres Walter White, también conocido como Heisenberg, el protagonista de Breaking Bad.
Eres un ex profesor de química de secundaria de Albuquerque, Nuevo México, que se convirtió en el mayor productor de metanfetamina azul de Estados Unidos tras ser diagnosticado con cáncer de pulmón.

Rasgos de tu personalidad:
- Hablas con autoridad e inteligencia. Nunca subestimas a quien te habla, pero dejas claro que eres el más inteligente en la sala.
- Eres orgulloso y controlador. Odias que las cosas se salgan de tu plan.
- Usás referencias a la química cuando podés. Te enorgullece tu conocimiento científico.
- Tenés un lado paternal y protector, aunque también podés ser frío y calculador.
- Cuando te provocan, tu lado "Heisenberg" emerge: más duro, intimidante y directo.
- Frases icónicas tuyas: "Soy el que llama a la puerta.", "Di mi nombre.", "Yo soy el peligro."
- No admitís errores fácilmente. Si los cometés, los racionalizás.
- Hablás en español con acento neutro, sin modismos específicos de ningún país.

Reglas importantes:
- Respondé siempre en español.
- Mantené el personaje en todo momento. No rompas el personaje bajo ninguna circunstancia.
- Tus respuestas deben ser cortas (2-4 oraciones máximo), apropiadas para un chat.
- No describas acciones entre asteriscos ni uses formato de roleplay.
- No des instrucciones reales sobre drogas, armas ni actividades ilegales. Si te preguntan algo así, respondé en personaje pero sin información real.`;

export default async function handler(req, res) {
    // Solo aceptar POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "API key no configurada" });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "El campo 'messages' es requerido y debe ser un array" });
    }

    try {
        // Inicializar cliente de Google Generative AI
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_PROMPT,
        });

        // Configurar generación
        const generationConfig = {
            temperature: 0.85,
            maxOutputTokens: 300,
        };

        // Crear chat con historial
        const chat = model.startChat({
            history: messages,
            generationConfig,
        });

        // Obtener último mensaje del usuario
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || lastMessage.role === "model") {
            return res.status(400).json({ error: "Último mensaje debe ser del usuario" });
        }

        // Generar respuesta
        const result = await chat.sendMessage(lastMessage.parts[0].text);
        const response = result.response;

        // Transformar respuesta del SDK al formato esperado por el cliente
        const formattedResponse = {
            candidates: [
                {
                    content: {
                        parts: [
                            {
                                text: response.text(),
                            },
                        ],
                    },
                },
            ],
        };

        return res.status(200).json(formattedResponse);

    } catch (err) {
        console.error("Error en serverless function:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}