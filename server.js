import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Habilitar CORS para cualquier origen
app.use(cors({ origin: "*" }));

// 🔹 Middleware para manejar headers adicionales y preflight OPTIONS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permitir cualquier origen
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Métodos permitidos
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Headers permitidos

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Responder preflight
  }

  next();
});

// 🔹 Endpoint raíz
app.get("/", (req, res) => {
  res.send("Servidor proxy Dexcom mock corriendo en Render");
});

// 🔹 Endpoint de glucosa mock
app.get("/glucosa-proxy", (req, res) => {
  console.log("Petición recibida desde Tizen:", req.headers["user-agent"]);

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.json({
    value: Math.floor(Math.random() * (180 - 60 + 1)) + 60, // glucosa aleatoria entre 60-180
    timestamp: new Date().toISOString()
  });
});

// 🔹 Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

