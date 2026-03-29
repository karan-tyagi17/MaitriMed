<div align="center">

<img src="https://img.shields.io/badge/SIH%202025-PS%20SIH25049-orange?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek0xMiAyMGMtNC40MiAwLTgtMy41OC04LThzMy41OC04IDgtOCA4IDMuNTggOCA4LTMuNTggOC04IDh6Ii8+PC9zdmc+" />

# 🏥 MaitriMed

### AI-Driven Public Health Chatbot for Disease Awareness

*Built for Smart India Hackathon 2025 — Problem Statement SIH25049*
*Ministry/Organization: Government of Odisha*

---

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![SIH](https://img.shields.io/badge/Smart%20India%20Hackathon-2025-red?style=flat-square)](https://www.sih.gov.in/)

</div>

---

## 📌 Problem Statement

**SIH25049** — Design an AI-powered public health chatbot that empowers citizens of Odisha with timely, accurate, and accessible information about disease awareness, prevention, and health schemes — bridging the communication gap between the government and the general public.

---

## 💡 Solution Overview

**MaitriMed** (Maitri = Friendship | Med = Medicine) is a conversational AI chatbot platform that provides:

- 🤖 Real-time disease awareness and symptom guidance
- 🏥 Information about government health schemes (Ayushman Bharat, Biju Swasthya Kalyan Yojana, etc.)
- 🌐 Multilingual support for regional accessibility
- 📊 Public health alerts and outbreak notifications
- 📍 Nearby health center locator
- 💊 Preventive care tips and health education

---

## 🏗️ Project Structure

```
MaitriMed/
├── frontend/               # React.js user interface
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── assets/         # Images, icons, styles
│   │   └── App.js
│   ├── package.json
│   └── .env.example
│
├── backend/                # Python (Flask/FastAPI) server
│   ├── app.py              # Main application entry
│   ├── routes/             # API route handlers
│   ├── models/             # AI/ML models
│   ├── utils/              # Helper utilities
│   ├── requirements.txt
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, CSS3, HTML5 |
| **Backend** | Python (Flask / FastAPI) |
| **AI/NLP** | LLM / NLP Pipeline |
| **Database** | MongoDB / PostgreSQL |
| **Deployment** | Render / Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- Python ≥ 3.10
- npm or yarn
- pip

---

### 🖥️ Frontend Setup

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

### ⚙️ Backend Setup

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

# Start the server
python app.py
```

Backend runs at: `http://localhost:5000`

---

## 🌍 Environment Variables

### Frontend (`frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME=MaitriMed
```

### Backend (`backend/.env`)

```env
FLASK_ENV=development
PORT=5000
DATABASE_URL=your_database_url
AI_API_KEY=your_ai_api_key
SECRET_KEY=your_secret_key
```

> ⚠️ **Never commit `.env` files to the repository.** They are already included in `.gitignore`.

---

## 📸 Screenshots

> *Add screenshots of your app here once deployed*

| Chat Interface | Disease Info | Health Schemes |
|:-:|:-:|:-:|
| Coming soon | Coming soon | Coming soon |

---

## 🤝 Team

| Name | Role |
|------|------|
| Karan Tyagi | Team Lead / Full Stack Developer |
| *(Add teammates)* | *(Add roles)* |

---

## 📋 Features Roadmap

- [x] Frontend UI — Chat Interface
- [x] Backend API — Core Routes
- [ ] AI Model Integration
- [ ] Multilingual Support (Odia, Hindi)
- [ ] Government Scheme Info Module
- [ ] Health Center Locator (Maps Integration)
- [ ] Deployment on Cloud

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- Smart India Hackathon 2025
- Government of Odisha — Ministry of Health
- All mentors and evaluators

---

<div align="center">

Made with ❤️ for the people of Odisha

*"Maitri — Because healthcare starts with friendship"*

</div>
