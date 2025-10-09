import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 Habilitar CORS (para que Tizen pueda hacer fetch desde otro origen)
app.use(cors());

// Endpoint raíz
app.get("/", (req, res) => {
  res.send("Servidor Dexcom Mock funcionando. Usa /glucosa-mock para obtener glucosa simulada.");
});

// Endpoint de glucosa mock
app.get("/glucosa-mock", (req, res) => {
  // Generar un valor aleatorio entre 70 y 180 mg/dL
  const valor = Math.floor(Math.random() * (180 - 70 + 1)) + 70;

  res.json({ value: valor });
});

// Opcional: endpoints Dexcom reales si los quieres usar después
app.get("/auth", (req, res) => {
  res.send("Endpoint /auth aquí si luego quieres integrar Dexcom real");
});

app.get("/callback", (req, res) => {
  res.send("Endpoint /callback aquí si luego quieres integrar Dexcom real");
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor mock de glucosa corriendo en puerto ${PORT}`);
});
