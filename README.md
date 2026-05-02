# 🔐 KeyVault-API-Share

> **Securely share your API keys with teammates, classmates & collaborators — without ever exposing the actual key.**

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)
![No DB](https://img.shields.io/badge/Database-None%20Required-brightgreen?style=flat)

---

## 💡 The Problem

You have an API key (OpenAI, Gemini, HuggingFace, etc.) and want to share it with your team or classmates for a project — but sharing the raw key is risky. Anyone can misuse it, exceed limits, or expose it publicly.

## ✅ The Solution

KeyVault lets you generate a **share token** for any API key. You share the token, not the key. The server handles the rest — enforcing limits, tracking usage, and letting you revoke access instantly.

---

## ✨ Features

- 🔑 **Token-based sharing** — teammates never see your real API key
- 📊 **Usage tracking** — see how many calls each token has used
- 🚫 **Call limits** — set max calls per token (e.g. 100 calls)
- ⛔ **Instant revoke** — cut off access anytime
- ↺ **Reset counters** — give someone a fresh quota
- 🌐 **Language agnostic** — works from Python, JavaScript, Dart, anything
- 💾 **Zero database** — runs fully in memory, no setup needed
- 🎨 **Beautiful dashboard** — clean admin UI included

