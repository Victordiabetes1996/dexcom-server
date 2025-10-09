import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Habilitar CORS para Tizen
app.use(cors({ origin: "*" }));

// 🔹 Proxy seguro que siempre devuelve JSON
app.get("/glucosa-proxy", (req, res) => {
  console.log("Petición recibida desde Tizen:", req.headers["user-agent"]);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.json({
    value: 81,                     // glucosa mock
    timestamp: new Date().toISOString()
  });
});

// 🔹 Endpoint raíz
app.get("/", (req, res) => {
  res.send("Servidor proxy Dexcom mock corriendo");
});

// 🔹 Arrancar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
