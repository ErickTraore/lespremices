// File: media-backend/app.js

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

const app = express();

// 🔐 Charger .env.production
dotenv.config({ path: path.join(__dirname, '.env.production') });

// 🌍 Origines autorisées à partir de REACT_APP_URL
const BASE_ORIGIN = process.env.REACT_APP_URL;
const allowedOrigins = [
  BASE_ORIGIN && BASE_ORIGIN.replace('://', '://www.') 
].filter(Boolean);

// CORS global
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Parsers
// 📦 Limite d’upload depuis .env
const MAX_UPLOAD = process.env.UPLOAD_LIMIT_MB
  ? `${process.env.UPLOAD_LIMIT_MB}mb`
  : "600mb"; // fallback sécurisé

app.use(express.json({ limit: MAX_UPLOAD }));
app.use(express.urlencoded({ extended: true, limit: MAX_UPLOAD }));


// (Optionnel) autres origines supplémentaires via ALLOWED_ORIGINS
const extraAllowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(o => o.length > 0);

// 🔓 Fichiers statiques uploadés
app.use('/api/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/api/uploads/videos', express.static(path.join(__dirname, 'uploads/videos')));
app.use('/imagesprofile', express.static(path.join(__dirname, 'uploads/imagesprofile')));

// 🔹 Images par défaut
app.use('/mediaprofile', express.static(path.join(__dirname, 'public/mediaprofile')));
app.use('/api/media/mediaprofile', express.static(path.join(__dirname, 'public/mediaprofile')));
app.use('/imagesprofile', express.static(path.join(__dirname, 'uploads/imagesprofile')));

// Routes API media (préfixe /api/media/)
const apiRouter = require('./apiRouter').router;
app.use('/api/media', apiRouter);

module.exports = app;