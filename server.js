import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Habilitar CORS para todas las peticiones
app.use(cors());

// 🔹 Endpoint mock de glucosa
app.get("/glucosa-mock", (req, res) => {
  res.json({
    value: 81, // valor de glucosa
    timestamp: new Date().toISOString() // fecha/hora actual
  });
});

// 🔹 Endpoint raíz
app.get("/", (req, res) => {
  res.send("Servidor Dexcom mock corriendo");
});

// 🔹 Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
