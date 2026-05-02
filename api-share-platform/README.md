# 🔐 KeyVault — API Key Sharing Platform

> **CSE AIML Project** | Share your API keys with friends/classmates securely with usage limits & token control.

---

## 🚀 How to Run

### Prerequisites
- **Node.js** installed → [Download here](https://nodejs.org) (v16 or above)

### Steps

```bash
# 1. Extract the zip and open the folder
cd api-share-platform

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open your browser
# Go to → http://localhost:3000
```

---

## 🔑 Default Admin Password
```
admin123
```
> Change it by setting an environment variable:
> ```bash
> ADMIN_PASSWORD=mysecretpass node server.js
> ```

---

## 📖 How It Works

| Role | What they do |
|------|-------------|
| **You (Admin)** | Add your API key, set a call limit, generate a share token |
| **Your Friend** | Receives the token (not the actual key), uses it in their project |
| **Server** | Returns the real API key only when called via token, tracks usage |

---

## 🌐 API Endpoints

### User Endpoints (for friends)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/token/:token/info` | Check token status & remaining calls |
| POST | `/api/token/:token/use` | Get the API key (uses 1 call from quota) |

### Admin Endpoints (for you)
All require header: `x-admin-password: admin123`

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/admin/create` | Create a new share token |
| GET | `/api/admin/list` | List all your tokens |
| DELETE | `/api/admin/revoke/:token` | Revoke a token |
| DELETE | `/api/admin/delete/:token` | Delete a token permanently |
| POST | `/api/admin/reset/:token` | Reset usage counter |

---

## 💻 Friend's Code Example

```javascript
// In your friend's project (JavaScript/Node.js)
const res = await fetch('http://YOUR_IP:3000/api/token/YOUR_TOKEN/use', {
  method: 'POST'
});
const data = await res.json();
const apiKey = data.apiKey; // Use this in your API call!
```

```python
# Python example
import requests
res = requests.post('http://YOUR_IP:3000/api/token/YOUR_TOKEN/use')
api_key = res.json()['apiKey']
```

---

## ✨ Features
- 🔒 API keys never directly exposed — only returned via token
- 📊 Per-token call limits & usage tracking
- ⛔ Revoke tokens instantly
- ↺ Reset usage counters
- 🌐 REST API — works with any programming language
- 💾 No database needed — runs fully in memory

---

## 🎓 Built for CSE AIML Students
Perfect for:
- Group projects where one person has the API key
- Hackathons
- Sharing OpenAI / Gemini / HuggingFace keys with classmates
- Learning REST API design

---
**Tech Stack**: Node.js · Express · Vanilla JS · HTML/CSS
