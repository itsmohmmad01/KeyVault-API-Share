const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── In-Memory Store (no DB needed to run) ───────────────────────────────────
// Structure: { [shareToken]: { apiKey, label, service, maxCalls, usedCalls, createdAt, active } }
const store = {};

// Admin password (change this!)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: "Too many requests, slow down!" },
});
app.use("/api/", limiter);

// ─── Admin Auth Middleware ────────────────────────────────────────────────────
function adminAuth(req, res, next) {
  const pwd = req.headers["x-admin-password"];
  if (pwd !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized. Wrong admin password." });
  }
  next();
}

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

// Create a new share token for an API key
app.post("/api/admin/create", adminAuth, (req, res) => {
  const { apiKey, label, service, maxCalls } = req.body;
  if (!apiKey || !label || !service) {
    return res.status(400).json({ error: "apiKey, label, and service are required." });
  }
  const token = uuidv4();
  store[token] = {
    apiKey,
    label,
    service,
    maxCalls: maxCalls || 100,
    usedCalls: 0,
    createdAt: new Date().toISOString(),
    active: true,
  };
  res.json({
    success: true,
    token,
    message: `Share this token with your friend: ${token}`,
  });
});

// List all shared tokens (masked API keys)
app.get("/api/admin/list", adminAuth, (req, res) => {
  const list = Object.entries(store).map(([token, data]) => ({
    token,
    label: data.label,
    service: data.service,
    maxCalls: data.maxCalls,
    usedCalls: data.usedCalls,
    active: data.active,
    createdAt: data.createdAt,
    apiKeyMasked: data.apiKey.slice(0, 6) + "••••••••" + data.apiKey.slice(-4),
  }));
  res.json({ tokens: list });
});

// Revoke a token
app.delete("/api/admin/revoke/:token", adminAuth, (req, res) => {
  const { token } = req.params;
  if (!store[token]) return res.status(404).json({ error: "Token not found." });
  store[token].active = false;
  res.json({ success: true, message: "Token revoked." });
});

// Delete a token completely
app.delete("/api/admin/delete/:token", adminAuth, (req, res) => {
  const { token } = req.params;
  if (!store[token]) return res.status(404).json({ error: "Token not found." });
  delete store[token];
  res.json({ success: true, message: "Token deleted." });
});

// Reset usage count
app.post("/api/admin/reset/:token", adminAuth, (req, res) => {
  const { token } = req.params;
  if (!store[token]) return res.status(404).json({ error: "Token not found." });
  store[token].usedCalls = 0;
  res.json({ success: true, message: "Usage reset." });
});

// ─── USER ROUTES (for people you share tokens with) ──────────────────────────

// Check token info (no API key revealed)
app.get("/api/token/:token/info", (req, res) => {
  const data = store[req.params.token];
  if (!data) return res.status(404).json({ error: "Invalid token." });
  if (!data.active) return res.status(403).json({ error: "This token has been revoked." });
  res.json({
    label: data.label,
    service: data.service,
    usedCalls: data.usedCalls,
    maxCalls: data.maxCalls,
    remainingCalls: data.maxCalls - data.usedCalls,
    active: data.active,
  });
});

// Use the token — returns the actual API key (call limit enforced)
app.post("/api/token/:token/use", (req, res) => {
  const data = store[req.params.token];
  if (!data) return res.status(404).json({ error: "Invalid token." });
  if (!data.active) return res.status(403).json({ error: "This token has been revoked." });
  if (data.usedCalls >= data.maxCalls) {
    return res.status(429).json({ error: "Call limit reached. Contact the key owner." });
  }
  data.usedCalls += 1;
  res.json({
    success: true,
    service: data.service,
    apiKey: data.apiKey,
    callsUsed: data.usedCalls,
    callsRemaining: data.maxCalls - data.usedCalls,
  });
});

// ─── Catch-all → serve frontend ──────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n✅  API Share Platform running at http://localhost:${PORT}`);
  console.log(`🔑  Admin Password: ${ADMIN_PASSWORD}`);
  console.log(`\n📖  Open your browser at http://localhost:${PORT}\n`);
});
