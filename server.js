import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Habilitar CORS para cualquier origen
app.use(cors({ origin: "*" }));

// 🔹 Headers adicionales para máxima compatibilidad con Tizen
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // Responder OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// 🔹 Endpoint de glucosa mock
app.get("/glucosa-proxy", (req, res) => {
  console.log("Petición recibida desde Tizen:", req.headers["user-agent"]);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.json({
    value: 81,
    timestamp: new Date().toISOString()
  });
});

// 🔹 Endpoint raíz
app.get("/", (req, res) => {
  res.send("Servidor proxy Dexcom mock corriendo en Render");
});

// 🔹 Arrancar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
