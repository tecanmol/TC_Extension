# 📘 T&C Guardian — AI Terms & Conditions Analyzer (Chrome Extension)

**T&C Guardian** is a Chrome extension that automatically analyzes a website’s **Terms & Conditions** using AI and highlights important information such as:

- 📝 **Summary of the agreement**
- 🚩 **Potentially unfair or risky clauses**
- ✅ **User-friendly policies**

The extension extracts text from the current webpage, sends it to an **AI-powered backend**, and displays a structured analysis directly inside the extension popup.

---

# ✨ Features

## 🔍 Smart Content Extraction

Automatically extracts relevant text from:

- `<main>`
- `<article>`
- `<body>`

Removes unnecessary tags such as:

```
script
style
nav
footer
iframe
noscript
```

---

## 🤖 AI-Powered Legal Analysis

Uses **OpenRouter AI** to analyze Terms & Conditions and generate:

- Clear **human-readable summary**
- Detailed **red flags**
- Helpful **good points**

Model used:

```
liquid/lfm-2.5-1.2b-thinking:free
```

---

## ⚡ Clean UI Built with React

Popup interface built using:

- React 19
- Vite
- TailwindCSS
- Styled Components

Includes:

- Loading animation
- Error handling
- Structured results display

---

## 🔄 Chrome Extension Messaging Architecture

Communication flow:

```
Popup (React UI)
      ↓
Content Script
      ↓
Backend API
      ↓
OpenRouter AI
      ↓
Popup UI Result Display
```

---

# 🏗️ Project Architecture

```
tecanmol-tc_extension/
│
├── README.md
├── package.json
├── vite.config.js
├── index.html
├── eslint.config.js
│
├── public/
│   ├── manifest.json
│   └── assets/
│       ├── background.js
│       └── content.js
│
├── server/
│   ├── package.json
│   └── server.js
│
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── App.css
    ├── index.css
    └── components/
        ├── AnalysisDisplay.jsx
        ├── AnalysisDisplay.css
        ├── Button.jsx
        └── Loading.jsx
```

---

# ⚙️ How It Works

## 1️⃣ User clicks **Analyze**

Inside the popup UI:

```javascript
chrome.tabs.sendMessage(tabId, { action: "RUN_ANALYZE" });
```

---

## 2️⃣ Content Script Extracts Webpage Text

The extension:

- Finds the main content area
- Removes unwanted HTML tags
- Extracts clean readable text

Maximum allowed length:

```
80,000 characters
```

---

## 3️⃣ Text Sent to Backend API

The extracted text is sent to the server:

```
POST /api/analyze
```

Example request:

```json
{
  "text": "Website terms and conditions text..."
}
```

---

## 4️⃣ Backend Sends Prompt to AI

The backend:

1. Receives page text
2. Sends prompt to OpenRouter
3. Requests structured JSON response

Expected format:

```json
{
  "summary": "Explanation of the service",
  "red_flags": ["Potential risks"],
  "good_points": ["User friendly clauses"]
}
```

---

## 5️⃣ Extension Displays Results

The popup UI displays:

- Summary section
- Red flags list
- Good points list

Each section uses **visual indicators and badges** for clarity.

---

# 🚀 Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/tc-extension.git
cd tc-extension
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Setup Backend Environment

Create a `.env` file inside the `server` folder.

```
server/.env
```

Add your **OpenRouter API key**:

```
API_KEY=your_openrouter_api_key_here
```

---

## 4️⃣ Start the Backend Server

```bash
cd server
node server.js
```

Server will run at:

```
http://localhost:3000
```

---

## 5️⃣ Run the React Extension UI

From the root folder:

```bash
npm run dev
```

---

## 6️⃣ Load Extension in Chrome

1. Open:

```
chrome://extensions
```

2. Enable **Developer Mode**

3. Click **Load unpacked**

4. Select the project folder:

```
tecanmol-tc_extension
```

Your extension is now installed.

---

# 🛠️ Tech Stack

## Frontend

- React 19
- Vite
- TailwindCSS
- Styled Components
- Chrome Extension Manifest V3

---

## Backend

- Node.js
- Express
- OpenRouter AI SDK
- Dotenv
- CORS

---

# 📡 API Specification

### Endpoint

```
POST /api/analyze
```

---

### Request Body

```json
{
  "text": "Extracted webpage text"
}
```

---

### Response Format

```json
{
  "summary": "Detailed summary",
  "red_flags": [
    "Risk explanation"
  ],
  "good_points": [
    "User benefit explanation"
  ]
}
```

---

# 📜 Available Scripts

| Command | Description |
|-------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production extension |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run server` | Run backend with auto reload |
| `npm start` | Start backend server |

---

# ⚠️ Important Notes

### Text Length Limit

The extension limits extracted content to:

```
80,000 characters
```

This prevents API overload and improves performance.

---

### AI JSON Cleanup

AI responses may contain markdown formatting such as:

```json
{ ... }
```

The backend automatically **removes markdown wrappers** before parsing.

---

# 🤝 Contributing

Contributions are welcome.

Possible improvements:

- Better webpage content detection
- Improved AI prompt engineering
- Performance optimization
- UI/UX improvements
- Multi-language support
- Chrome Web Store deployment

---

# 📄 License

This project is licensed under the **MIT License**.

---

# ⭐ Support the Project

If you found this project useful:

⭐ Star the repository  
🍴 Fork it  
🛠 Contribute improvements

