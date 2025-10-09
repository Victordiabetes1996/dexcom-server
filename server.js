import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Habilitar CORS para Tizen
app.use(cors({
  origin: "*" // Permite cualquier origen (solo para pruebas)
}));

// 🔹 Proxy hacia el servidor Render
app.get("/glucosa-proxy", async (req, res) => {
  try {
    const response = await fetch("https://dexcom-server-wwtx.onrender.com/glucosa-mock", {
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      return res.status(response.status).send({ error: "Error al obtener datos desde Render" });
    }

    const text = await response.text();
    if (!text || !text.trim()) {
      return res.status(500).send({ error: "Respuesta vacía del servidor Render" });
    }

    const data = JSON.parse(text);
    res.json(data); // Reenvía JSON a Tizen
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Endpoint raíz
app.get("/", (req, res) => {
  res.send("Servidor proxy Dexcom corriendo");
});

// 🔹 Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
