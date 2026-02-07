<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎯 BoardVision

An intelligent AI-powered studio app that transforms your whiteboard sketches, notes, and code into interactive learning experiences. Powered by Google's Gemini AI.

## ✨ Features

- **📸 Image Analysis** - Upload whiteboard sketches, diagrams, and images for AI-powered analysis
- **💬 Smart Chat** - Interactive chat with context-aware responses about your uploaded content
- **🧠 Flashcard Generation** - Automatically create practice flashcards and quizzes from analyzed content
- **💻 Code Display** - View and interact with code snippets with syntax highlighting and LaTeX math support
- **🌙 Dark Mode** - Toggle between light and dark themes for comfortable viewing
- **📜 History Tracking** - Keep a history of all your analyses and interactions
- **⚡ Real-time Processing** - Instant analysis with Gemini AI

## 🚀 Quick Start

**Prerequisites:** Node.js (v14+)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up API key:**
   - Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
   - Create or update [.env.local](.env.local) with:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

## 🔨 Build & Deploy

- **Build for production:** `npm run build`
- **Preview production build:** `npm run preview`

View your app in AI Studio: https://ai.studio/apps/drive/1yGw6WVgKT-hxe9Bv-v0cBfP2xGmBdD9w

## 🏗️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Google Generative AI** - Gemini API integration
- **Lucide Icons** - Beautiful icons
- **React Markdown** - Markdown rendering with LaTeX support

## 📁 Project Structure

```
VisionBoard/
├── components/          # React components
│   ├── AuthScreen.tsx   # Authentication
│   ├── ChatInterface.tsx # Chat feature
│   ├── CodeDisplay.tsx   # Code rendering
│   ├── FlashcardReview.tsx # Quiz interface
│   ├── Sidebar.tsx       # Navigation sidebar
│   └── UploadArea.tsx    # File upload
├── services/
│   └── geminiService.ts  # Gemini API integration
├── App.tsx              # Main application
└── types.ts             # TypeScript definitions
```
