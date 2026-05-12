import { createServer } from "http";
import { readFile } from "fs/promises";
import { readFileSync as readFileSync2 } from "fs";
import { extname, join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 8080;

// Cargar variables de entorno desde .env.local
try {
  const env = readFileSync2(join(__dirname, ".env.local"), "utf-8");
  env.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) process.env[key.trim()] = value.trim();
  });
} catch {}

console.log("API KEY cargada:", process.env.GEMINI_API_KEY ? "SÍ" : "NO");

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
};

const server = createServer(async (req, res) => {
  if (req.url === "/api/functions" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { default: handler } = await import("./api/functions.js");
        const mockRes = {
          statusCode: 200,
          headers: {},
          status(code) { this.statusCode = code; return this; },
          json(data) {
            res.writeHead(this.statusCode, { "Content-Type": "application/json" });
            res.end(JSON.stringify(data));
          },
        };
        await handler({ method: "POST", body: JSON.parse(body) }, mockRes);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error interno" }));
      }
    });
    return;
  }

  const url = req.url === "/" ? "/index.html" : req.url;
  const ext = extname(url) || ".html";

  if (!extname(req.url) && req.url !== "/") {
    try {
      const fallback = await readFile(join(__dirname, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(fallback);
    } catch {
      const fallback = await readFile(join(__dirname, "src", "index.html"));
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(fallback);
    }
    return;
  }

  let content;
  try {
    content = await readFile(join(__dirname, url));
  } catch {
    try {
      content = await readFile(join(__dirname, "src", url));
    } catch {
      try {
        const fallback = await readFile(join(__dirname, "index.html"));
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(fallback);
      } catch {
        const fallback = await readFile(join(__dirname, "src", "index.html"));
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(fallback);
      }
      return;
    }
  }

  res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
  res.end(content);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Puerto ${PORT} ocupado. Cerrá otros servidores y volvé a intentar.`);
    process.exit(1);
  }
});

server.listen(PORT, () => console.log(`Dev server running at http://localhost:${PORT}`));