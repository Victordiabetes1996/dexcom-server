import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para Tizen
app.use(cors({ origin: "*" }));

// Proxy seguro que siempre devuelve datos mock
app.get("/glucosa-proxy", (req, res) => {
  console.log("Petición recibida desde Tizen:", req.headers["user-agent"]);
  res.setHeader("Content-Type", "application/json");
  res.json({
    value: 81,
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => res.send("Servidor proxy Dexcom mock corriendo"));

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
