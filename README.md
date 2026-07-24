# HackJudge (PitchPerfect AI) 🚀

HackJudge is an AI-powered mock hackathon interview preparation application. It allows developers and hackathon participants to pitch their project slide decks, interact with specialized AI judge panels in real-time using voice activity detection, and receive diagnostic ATS-style performance rubrics to refine their hackathon pitches.

---

## 🌟 Key Features

### 1. Project Slide Ingestion
- Submit your project title, problem statement, solution description, key features, and technology stack.
- Submit your project deck/presentation (ppt).
- The AI analyzes these slides and project details to tailor its questions specifically to your project's architecture and domain.

### 2. Different AI Judge Personas

- **Hackathon (Default):** Simulates an experienced hackathon judge who evaluates projects from multiple perspectives, including innovation, technical implementation, product design, user experience, business potential, and overall impact.

- **Technical:** Focuses on software engineering aspects such as system architecture, scalability, APIs, database design, security, performance, and implementation decisions.

- **Business:** Evaluates the project's market potential, business model, revenue strategy, competitive landscape, target audience, and long-term scalability as a business.

- **Product:** Assesses problem-solution fit, user experience, usability, feature prioritization, customer value, and overall product thinking.

- **AI/ML:** Examines AI-specific aspects including model selection, data pipeline, prompt engineering, inference workflow, evaluation metrics, model limitations, and AI reliability.

### 3. Smart Voice QA Room
- Speak naturally to the AI judge with real-time **Deepgram Speech-to-Text (STT)** integration.
- Automated, natural conversation turn-taking powered by **Voice Activity Detection (VAD)**.
- Low-latency, authentic voice responses streamed in real-time chunks via **ElevenLabs Speech Synthesis (TTS)** over WebSockets.

### 4. Advanced Scorecards & Multiple Attempts
- View comprehensive scores out of 10 for criteria like Innovation, Feasibility, and Q&A delivery.
- Save and navigate through multiple attempt histories horizontally on the dashboard.
- Update/delete projects or start new mock interviews to track your progress score trend.

---

## 🛠️ Technology Stack

### Client (Frontend)
- **Framework**: React 19, Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: Firebase Client SDK

### Server (Backend)
- **Runtime**: Node.js (ES Modules), Express
- **Real-time communication**: Raw Node.js WebSockets (`ws` library)
- **LLM/AI Engine**: Google GenAI (Gemini SDK - `gemini-3.1-flash-lite`)
- **Voice Generation**: ElevenLabs TTS API (Real-time audio chunk streaming)
- **Speech Recognition**: Deepgram STT (Real-time WebSocket transcription API)
- **Database & Storage**: Firebase Admin SDK (Firestore)

---

## 🏗️ System Architecture

For a detailed explanation, see [Architecture.md](./Architecture.md).

---

## ⚙️ Environment Variables

### Client (`/client/.env`)
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_PRESET_NAME=your_preset_name
VITE_BACKEND_WS_URL=ws://localhost:8000
```

### Server (`/server/.env`)
```env
PORT=8000
EXPRESS_FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-3.1-flash-lite
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id
DEEPGRAM_API_KEY=your_deepgram_api_key

# Firebase Admin configuration requires serviceAccount.json at /server/serviceAccount.json
```

---

## 📂 Database Schema (Firestore)

HackJudge relies on three core Firestore collections:
1. **`projects`**: Stores the submitted hackathon project details (Title, Problem Statement, Description, Tech Stack, feature list).
2. **`interviews`**: Keeps track of the live conversation logs (interviewer question / candidate answer) and status metadata.
3. **`feedback`**: Stores final evaluations containing conversation summaries (`convosummary`), category breakdowns (`categoryfeedback` for problem understanding, solution clarity, innovation), detailed Q&A feedback lists (`convofeedback`), and relationship IDs (`projectId`, `userId`, `interviewId`).

---

## 🚀 Getting Started

### 1. Installation

Clone this repository and install dependencies for both the frontend and backend folders:

```bash
# Install frontend client dependencies
cd client
npm install

# Install backend server dependencies
cd ../server
npm install
```

### 2. Running in Development Mode

Run the development servers concurrently:

```bash
# Start backend server (starts on port 8000)
cd server
npm run dev

# Start frontend dev server (starts on http://localhost:5173)
cd ../client
npm run dev
```
