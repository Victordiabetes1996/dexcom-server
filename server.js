import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Habilitar CORS (permite peticiones desde tu frontend o smartwatch)
app.use(
  cors({
    origin: "*", // o reemplaza por tu dominio si quieres más seguridad
    methods: ["GET", "POST"],
  })
);

let accessToken = process.env.ACCESS_TOKEN;
let refreshToken = process.env.REFRESH_TOKEN;

// 1️⃣ Endpoint raíz: estado del servidor
app.get("/", (req, res) => {
  res.send("✅ Servidor Dexcom funcionando. Usa /auth para autorizar y /glucosa para leer glucosa.");
});

// 2️⃣ Endpoint para iniciar autenticación OAuth de Dexcom (sandbox)
app.get("/auth", (req, res) => {
  const url = `https://sandbox-api.dexcom.com/v2/oauth2/login?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=offline_access read:glucose`;
  res.redirect(url);
});

// 3️⃣ Callback de Dexcom (recibe el authorization code)
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("No se recibió ningún código de autorización.");

  const body = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: process.env.REDIRECT_URI,
  });

  try {
    const response = await fetch("https://sandbox-api.dexcom.com/v2/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = await response.json();
    console.log("✅ Token recibido de Dexcom:", data);

    accessToken = data.access_token;
    refreshToken = data.refresh_token;

    res.send("🎉 Autorización exitosa. Puedes cerrar esta página y consultar /glucosa.");
  } catch (err) {
    console.error("❌ Error en callback Dexcom:", err);
    res.status(500).send(err.toString());
  }
});

// 4️⃣ Endpoint para obtener glucosa real (si Dexcom responde)
app.get("/glucosa", async (req, res) => {
  if (!accessToken) return res.status(400).json({ error: "No access token. Autoriza primero en /auth" });

  try {
    const response = await fetch("https://sandbox-api.dexcom.com/v2/users/self/egvs", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    console.log("📡 Respuesta de Dexcom:", data);

    if (!data.egvs || data.egvs.length === 0) {
      return res.json({ value: null, message: "No hay lecturas disponibles" });
    }

    const valor = data.egvs[0].value;
    const timestamp = data.egvs[0].displayTime;

    res.json({ value: valor, timestamp });
  } catch (err) {
    console.error("❌ Error al obtener glucosa:", err);
    res.status(500).json({ error: err.toString() });
  }
});

// 5️⃣ Mock temporal para pruebas sin Dexcom real
app.get("/glucosa-mock", (req, res) => {
  const mock = {
    value: Math.floor(Math.random() * 40) + 80, // valor aleatorio entre 80–120
    timestamp: new Date().toISOString(),
  };
  res.json(mock);
});

// 🚀 Arranque del servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
