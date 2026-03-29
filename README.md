![SIH 2025](https://img.shields.io/badge/SIH%202025-PS%20SIH25049-orange?style=for-the-badge)

# 🏥 MaitriMed

### AI-Driven Public Health Chatbot for Disease Awareness

*Built for Smart India Hackathon 2025 — Problem Statement SIH25049*  
*Ministry/Organization: Government of Odisha*

---

[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Ollama](https://img.shields.io/badge/Ollama-Local%20LLM-black?style=flat-square)](https://ollama.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)
[![SIH](https://img.shields.io/badge/Smart%20India%20Hackathon-2025-red?style=flat-square)](https://www.sih.gov.in/)

---

## 📌 Problem Statement

**SIH25049** — Design an AI-powered public health chatbot that empowers citizens of Odisha with timely, accurate, and accessible information about disease awareness, prevention, and health schemes — bridging the communication gap between the government and the general public.

---

## 💡 Solution Overview

**MaitriMed** (Maitri = Friendship | Med = Medicine) is a conversational AI chatbot platform powered by a **locally-hosted LLM via Ollama**, ensuring data privacy and offline-friendly capability. It provides:

- 🤖 Real-time disease awareness and symptom guidance
- 🏥 Information about government health schemes (Ayushman Bharat, Biju Swasthya Kalyan Yojana, etc.)
- 🌐 Multilingual support for regional accessibility
- 📊 Public health alerts and outbreak notifications
- 📍 Nearby health center locator
- 💊 Preventive care tips and health education
- 🔒 Privacy-first AI — powered by a local LLM (no external API calls)

---

## 🏗️ Project Structure

```
MaitriMed/
├── frontend/                      # React + TypeScript user interface
│   ├── public/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Application pages
│   │   ├── assets/                # Images, icons, styles
│   │   └── App.tsx
│   ├── package.json
│   └── .env.example
│
├── backend/                       # Python FastAPI server
│   ├── main.py                    # FastAPI application entry point
│   ├── routers/                   # API route handlers
│   ├── models/                    # Pydantic schemas & data models
│   ├── services/                  # Business logic & Ollama LLM integration
│   ├── utils/                     # Helper utilities
│   ├── requirements.txt
│   └── .env.example
│
├── screenshot/                    # App screenshots & demo images
│
├── MaitriMed_Project_Report.docx  # Full project report (SIH 2025 submission)
├── .gitignore
└── README.md
```

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, TypeScript, CSS3, HTML5 |
| **Backend** | Python, FastAPI |
| **AI / LLM** | Ollama (Local LLM — e.g. LLaMA 3, Mistral) |
| **API Style** | REST (auto-docs via Swagger UI at `/docs`) |
| **Deployment** | Render (backend) / Vercel (frontend) |

---

## 📸 Screenshots

> See the [`screenshot/`](./screenshot) folder for app previews.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- Python ≥ 3.10
- npm or yarn
- pip
- [Ollama](https://ollama.com/download) installed and running locally

---

### 🤖 Step 1 — Ollama Setup (Required for AI)

MaitriMed runs its AI entirely through a **local LLM via Ollama**. Set this up first before starting the backend:

```bash
# Install Ollama from https://ollama.com/download

# Pull a model (choose one)
ollama pull llama3
# or
ollama pull mistral

# Start the Ollama server
ollama serve
```

Ollama runs at: `http://localhost:11434`

---

### ⚙️ Step 2 — Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your values

# Start the FastAPI server
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`  
Swagger API Docs: `http://localhost:8000/docs`

---

### 🖥️ Step 3 — Frontend Setup (React + TypeScript)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your values

# Start development server
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🌍 Environment Variables

### Frontend (`frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_NAME=MaitriMed
```

### Backend (`backend/.env`)

```env
APP_ENV=development
PORT=8000
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
SECRET_KEY=your_secret_key
```

> ⚠️ **Never commit `.env` files to the repository.** They are already included in `.gitignore`.

---

## 📄 Project Report

The full project report submitted for SIH 2025 is available in the repository:  
📎 [`MaitriMed_Project_Report.docx`](./MaitriMed_Project_Report.docx)

---

## 🤝 Team

| Name | Role |
|---|---|
| Karan Tyagi | Team Lead / Full Stack Developer |
| *(Add teammates)* | *(Add roles)* |

---

## 📋 Features Roadmap

- [x] Frontend UI — Chat Interface (React + TypeScript)
- [x] Backend API — FastAPI Core Routes
- [x] Ollama Local LLM Integration
- [x] Project Report (SIH 2025 Submission)
- [ ] Multilingual Support (Odia, Hindi)
- [ ] Government Scheme Info Module
- [ ] Health Center Locator (Maps Integration)
- [ ] Cloud Deployment

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgements

- Smart India Hackathon 2025
- Government of Odisha — Ministry of Health
- [Ollama](https://ollama.com) — for making local LLMs accessible
- All mentors and evaluators

---

Made with ❤️ for the people of Odisha

*"Maitri — Because healthcare starts with friendship"*
