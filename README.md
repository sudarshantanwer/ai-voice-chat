# 🎙️ GenAI Voice Chat Assistant

A **full-stack GenAI voice assistant** that listens to your voice, understands your query, and responds back in **AI-generated speech** — end to end.

This application captures audio from the browser, transcribes it using **AWS Transcribe**, reasons using **LLMs via Amazon Bedrock**, and replies using **AWS Polly text-to-speech**.

---

## 🚀 Live Demo

> 🔗 **Live URL**: (Railway deployment)
> *(Access is limited to control cloud costs)*

---

## ✨ Key Features

* 🎙️ **Browser-based voice input**
* 📝 **Speech-to-text (STT)** using AWS Transcribe
* 🧠 **LLM-powered reasoning** using Amazon Bedrock
* 🔊 **Text-to-speech (TTS)** using AWS Polly
* 🇮🇳 Optimized for Indian users (language + UX)
* 🎨 **Modern, professional UI**
* ⏳ **Perceived streaming UX** (no “waiting” feeling)
* ☁️ **Deployed on Railway**
* 🔐 **Cost protection & rate limiting**

---

## 🏗️ Architecture Overview

```
Browser (Mic)
   ↓
Express API (/upload-audio)
   ↓
AWS S3 (audio storage)
   ↓
AWS Transcribe (Speech → Text)
   ↓
Amazon Bedrock (LLM reasoning)
   ↓
AWS Polly (Text → Speech)
   ↓
Browser (Audio playback)
```

---

## 🧠 Tech Stack

### Frontend

* HTML, CSS, Vanilla JavaScript
* Web Audio API (`MediaRecorder`)
* Modern UI with loading states & animations

### Backend

* Node.js (TypeScript)
* Express.js
* `tsx` for runtime execution

### AWS Services

* **S3** – Audio storage
* **Transcribe** – Speech to text
* **Bedrock** – LLM inference
* **Polly** – Text to speech

### Deployment

* **Railway** (free tier)
* HTTPS enabled
* Frontend served from backend

---

## 📁 Project Structure

```
├── src
│   ├── api
│   │   ├── uploadAudio.ts
│   │   └── voiceHandler.ts
│   ├── llm
│   │   └── bedrock.ts
│   ├── stt
│   │   └── transcribe.ts
│   ├── tts
│   │   └── polly.ts
│   └── server.ts
│
├── public
│   └── index.html
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file (or add these in Railway):

```env
PORT=3000
AWS_REGION=ap-south-1
AUDIO_BUCKET_NAME=your-s3-bucket-name

AWS_ACCESS_KEY_ID=xxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxx

# Optional safety controls
APP_TOKEN=your-secret-token
APP_ENABLED=true
```

---

## 🔐 IAM Permissions Required

The IAM user used by this app must have:

* `AmazonS3FullAccess`
* `AmazonTranscribeFullAccess`
* `AmazonPollyFullAccess`
* `AmazonBedrockFullAccess`

*(For production, these should be restricted using least-privilege policies.)*

---

## 🛠️ Local Development

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run the app

```bash
npm run dev
```

### 3️⃣ Open in browser

```
http://localhost:3000
```

> ⚠️ Use **Chrome** for best mic support.

---

## 🚢 Deployment (Railway)

* Frontend is served from `/public`
* Backend runs using `tsx src/server.ts`
* No separate frontend hosting required

**Start Command**

```bash
npm run start
```

---

## 💸 Cost Management (Important)

To prevent abuse and unexpected AWS bills, the app includes:

* ⏱️ **Audio length limits**
* 🚦 **Rate limiting (per IP)**
* 🔐 **Optional access token**
* 🧨 **Kill switch via env variable**
* 📊 **AWS budget alerts (recommended)**

---

## 🧪 API Endpoints

### `POST /upload-audio`

Uploads recorded audio to S3.

### `POST /voice`

Runs the full pipeline:

* STT → LLM → TTS
  Returns audio stream (`audio/mpeg`).

---

## 🎯 UX Highlights

* Clear voice states:

  * Listening
  * Uploading
  * Transcribing
  * Thinking
  * Speaking
* No dead waits
* Professional, calm UI
* Mobile-friendly layout

---

## 🚧 Known Limitations

* AWS Transcribe is **batch-based**, not real-time streaming
* True streaming TTS is not supported by AWS Polly
* Free Railway tier may sleep on inactivity
* AWS services are **pay-per-use**

---

## 🧠 Future Improvements

* Live transcription subtitles
* Streaming LLM responses
* User authentication & quotas
* Conversation memory
* Hindi / Hinglish voice support
* Mobile-first UI
* Switchable TTS providers (Azure / ElevenLabs)

---

## 📌 Why This Project Matters

This project demonstrates:

* Real-world **GenAI integration**
* Audio handling at scale
* Cloud cost awareness
* Production deployment mindset
* UX thinking beyond “it works”

It is **not a demo toy**, but a **deployable GenAI system**.

---

## 👨‍💻 Author

Built by **Sudarshan Tanwar**
Full-stack engineer focused on **AI, cloud, and real-world systems**.

---

## ⭐ Final Note

If you’re exploring:

* Voice AI
* LLM systems
* GenAI product architecture

This project is a solid **reference implementation**.

