# 📘 T&C Guardian — Chrome Extension

Analyze any website's **Terms & Conditions** automatically using AI.

This Chrome extension extracts text from the current webpage, sends it to a local AI-powered backend, and displays:

* 📝 **Summary**
* 🚩 **Red Flags** (unfair clauses)
* ✅ **Good Points**

...all in a clean UI built with React + Vite.

---

## 🚀 Features

* 🔍 **Extracts webpage content** (from `<main>` / `<article>` / `body`)
* 🤖 **AI-powered analysis** using the OpenRouter API (Grok 4.1 Fast)
* 🧹 **Cleans & limits text** before sending (max 120k chars)
* 📦 **Chrome Manifest V3** extension
* ⚛️ **React-based popup UI** with Tailwind + Styled Components
* 🔄 **Loading animation + status handling**
* 💬 **Background → Content → Popup messaging system**

---

## 🗂️ Project Structure

```
tecanmol-tc_extension/
│── README.md
│── eslint.config.js
│── index.html
│── package.json
│── vite.config.js
│
├── public/
│   ├── manifest.json
│   └── assets/
│       ├── background.js
│       └── content.js
│
├── server/
│   └── server.js
│
└── src/
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── main.jsx
    └── components/
        ├── AnalysisDisplay.jsx
        ├── AnalysisDisplay.css
        ├── Button.jsx
        └── Loading.jsx
```

---

## 🖥️ How It Works (Architecture)

### **1️⃣ User clicks "Analyze" in popup**

Popup → sends message to content script:

```js
chrome.tabs.sendMessage(tabId, { action: "RUN_ANALYZE" });
```

---

### **2️⃣ Content script extracts text**

Removes unwanted tags (script, style, nav, footer, iframe…)
Truncates long text to 120k chars.

Then it sends the text to your backend:

```
fetch("http://localhost:3000/api/analyze")
```

---

### **3️⃣ Backend (Node.js) calls OpenRouter AI**

Model: `x-ai/grok-4.1-fast:free`

Returns strict JSON:

```json
{ "summary": "...", "red_flags": [], "good_points": [] }
```

---

### **4️⃣ Popup UI updates**

React receives `ANALYSIS_RESULT` → displays:

* Summary
* Red Flags
* Good Points

Each with styling + animations.

---

## ⚙️ Installation & Setup

### **1️⃣ Install dependencies**

```bash
npm install
```

---

### **2️⃣ Add your OpenRouter API key**

Create a `.env` file inside `/server`:

```
API_KEY=your_openrouter_api_key_here
```

---

### **3️⃣ Start the backend**

```bash
cd server
node server.js
```

Runs at:

```
http://localhost:3000
```

---

### **4️⃣ Start the React popup UI**

```bash
npm run dev
```

---

### **5️⃣ Load the Chrome extension**

1. Open **chrome://extensions**
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the project folder (`tecanmol-tc_extension`)

**Your extension is now ready!**

---

## 🛠️ Tech Stack

### **Frontend**

* React 19
* TailwindCSS
* Styled Components
* Vite
* Chrome Extension Manifest V3

### **Backend**

* Node.js (Express)
* OpenRouter SDK
* CORS
* Dotenv

---

## 🔧 Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start Vite dev server    |
| `npm run build`   | Build extension UI       |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

---

## 🧪 API Response Format

The backend always returns:

```json
{
  "summary": "string",
  "red_flags": ["string", "string"],
  "good_points": ["string", "string"]
}
```

The popup parses and displays this safely.

---

## 🤝 Contributing

Pull requests are welcome!
If you want to improve the:

* UI/UX
* Content extraction logic
* Model prompt
* Performance
* Error handling

Feel free to contribute.

---

## 📄 License

MIT License.

---