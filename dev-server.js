import http from "http";
import fs from "fs";
import path from "path";
import url from "url";
import handler from "./api/functions.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = 5500;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    // Manejo de API
    if (req.url.startsWith("/api/")) {
        try {
            // Mock de req y res para la serverless function
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", async () => {
                req.body = body ? JSON.parse(body) : {};
                
                // Wrapper para res.status y res.json
                const resWrapper = {
                    status: (code) => {
                        res.writeHead(code, { "Content-Type": "application/json" });
                        return {
                            json: (data) => {
                                res.end(JSON.stringify(data));
                            },
                        };
                    },
                };

                await handler(req, resWrapper);
            });
        } catch (err) {
            console.error("Error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Error interno del servidor" }));
        }
        return;
    }

    // Manejo de archivos estáticos
    let filePath = path.join(__dirname, "src", req.url === "/" ? "index.html" : req.url);
    filePath = filePath.split("?")[0]; // Remover query strings

    const ext = path.extname(filePath);
    const mimeTypes = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon",
    };

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("<h1>404 - Archivo no encontrado</h1>");
            return;
        }

        res.writeHead(200, {
            "Content-Type": mimeTypes[ext] || "text/plain",
            "Cache-Control": "no-cache",
        });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📝 API disponible en http://localhost:${PORT}/api/functions`);
});
