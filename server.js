import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

let accessToken = process.env.ACCESS_TOKEN;
let refreshToken = process.env.REFRESH_TOKEN;

// 1️⃣ Endpoint raíz
app.get("/", (req, res) => {
  res.send("Servidor Dexcom funcionando. Usa /auth para autorizar y /glucosa para leer glucosa.");
});

// 2️⃣ Endpoint para iniciar OAuth Dexcom
app.get("/auth", (req, res) => {
  const url = `https://sandbox-api.dexcom.com/v2/oauth2/login?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=offline_access read:glucose`;
  res.redirect(url);
});

// 3️⃣ Callback Dexcom para recibir el authorization code
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("No authorization code found");

  const body = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: process.env.REDIRECT_URI
  });

  try {
    const response = await fetch("https://sandbox-api.dexcom.com/v2/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    const data = await response.json();

    // 🔍 Log completo para revisar tokens
    console.log("Respuesta Dexcom token:", data);

    accessToken = data.access_token;
    refreshToken = data.refresh_token;

    res.send("Autorización exitosa! Puedes cerrar esta página.");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

// 4️⃣ Endpoint para entregar glucosa a Tizen Web
app.get("/glucosa", async (req, res) => {
  if (!accessToken) return res.status(400).json({ error: "No access token. Autoriza primero en /auth" });

  try {
    console.log("Usando accessToken:", accessToken);

    const response = await fetch("https://sandbox-api.dexcom.com/v2/users/self/egvs", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const data = await response.json();

    // Validar que existan lecturas
    if (!data.egvs || data.egvs.length === 0) {
      return res.json({ value: null, message: "No hay lecturas disponibles" });
    }

    const valor = data.egvs[0].value;
    res.json({ value: valor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
  }
});

// 5️⃣ Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor Dexcom corriendo en puerto ${PORT}`);
});
