# Doc Agent — AI-Powered Documentation Generator

> We Built Doc_Agent with the help of Claude · AI Agent Track · Powered by Gemini 2.5

# What is Doc Agent?

Doc Agent is an intelligent documentation generator that takes your code and produces professional technical documentation instantly using Google's Gemini AI.

# Features
- Generate README, API Docs, and Function References
- Upload .py, .js, .ts and more
- Copy to clipboard or Download as .md
- Beautiful GitHub-style dark UI

---

# Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI + Python |
| AI | Google Gemini 2.5 |
| Styling | Custom CSS-in-JS |

---

# How to Run Locally

# Prerequisites
- Python 3.10+
- Node.js 18+
- Google Gemini API Key → [Get it here](https://aistudio.google.com/apikey)

---

# Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

# Setup Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install fastapi uvicorn python-dotenv google-genai python-multipart
```

Create your `.env` file:

```bash
cp .env.example .env
```

Open `.env` and add your Gemini API key:


Start the backend:

```bash
uvicorn main:app --reload
```

Backend runs at → `http://127.0.0.1:8000`

---

# Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

# How to Use

1. Open `http://localhost:5173`
2. Select documentation type (README / API Docs / Function Reference)
3. Paste your code or upload a file
4. Click **Generate Documentation**
5. Copy or Download the result

---

# Team
Built with ❤️