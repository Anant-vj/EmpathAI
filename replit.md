# 💎 EmpathAI - Sign Language Translator & Empathetic AI Companion

## Overview
EmpathAI is a full-stack web application combining two powerful features:
1. **Sign Language Translator** - Real-time hand gesture detection using MediaPipe with voice feedback
2. **MindMate Chat** - An empathetic AI companion powered by OpenAI GPT-4o-mini

**Current State**: ✅ Fully functional and deployed
**Last Updated**: November 8, 2025

## Project Architecture

### Tech Stack
- **Backend**: Node.js + Express.js + OpenAI SDK
- **Frontend**: React + Vite + TailwindCSS
- **AI/ML**: OpenAI GPT-4o-mini, MediaPipe Hands, Web Speech API
- **Port**: 5000 (unified backend + frontend serving)

### Project Structure
```
/
├── index.js                 # Express backend server
├── package.json            # Dependencies
├── vite.config.js          # Vite bundler config
├── tailwind.config.js      # TailwindCSS styling
├── postcss.config.js       # PostCSS config
├── index.html              # HTML entry point
├── dist/                   # Built frontend (generated)
└── src/
    ├── index.jsx           # React entry point
    ├── App.jsx             # Main app with tab switcher
    ├── Chat.jsx            # MindMate chat component
    ├── Translator.jsx      # Sign language translator
    └── styles.css          # Global styles + Tailwind
```

## Features Implemented

### 1. MindMate Chat 💬
- Real-time empathetic AI responses using GPT-4o-mini
- Clean, responsive chat interface with message history
- Timestamp tracking
- Error handling with user-friendly messages
- Auto-scroll to latest messages
- Loading states with animated indicators

### 2. Sign Language Translator 🤟
- Real-time hand gesture detection via MediaPipe Hands
- Visual hand landmark tracking overlaid on video
- Speech synthesis for detected gestures
- Confidence score display
- Support for 2 hands simultaneously
- Gestures detected: Thumbs Up, Victory, Open Palm, Pointing Up, and more

### 3. Design & UX
- Beautiful gradient UI with indigo/purple theme
- Responsive design (mobile-friendly)
- Tab-based navigation between features
- Accessible color contrast
- Smooth animations and transitions

## Environment Setup

### Required Secrets
- `OPENAI_API_KEY` - OpenAI API key for chat functionality (already configured)

### Dependencies
All dependencies are installed via npm:
- **Backend**: express, cors, dotenv, openai
- **Frontend**: react, react-dom, vite, @vitejs/plugin-react
- **AI/ML**: @mediapipe/tasks-vision
- **Styling**: tailwindcss, autoprefixer, postcss

## How It Works

### Backend (index.js)
- Serves the React frontend from `/dist`
- `/api/chat` POST endpoint for AI chat responses
- `/api/health` GET endpoint for health checks
- Empathetic system prompt for compassionate responses
- Comprehensive error handling for API issues

### Frontend
- **App.jsx**: Tab switcher managing Chat/Translator views
- **Chat.jsx**: Chat interface with message state management, API calls to `/api/chat`
- **Translator.jsx**: Camera access, MediaPipe gesture recognition, speech synthesis

## Testing & Usage

### Testing MindMate Chat
1. Navigate to "MindMate Chat" tab
2. Type a message in the text area
3. Press Enter or click "Send"
4. AI responds with empathetic, supportive messages

### Testing Sign Language Translator
1. Navigate to "Sign Language Translator" tab
2. Click "Start Camera" and grant camera permissions
3. Make hand gestures in front of the camera
4. Gestures are detected, displayed with confidence scores, and spoken aloud

### Known Gestures
- Thumbs Up 👍
- Victory ✌️
- Open Palm ✋
- Pointing Up ☝️
- ILoveYou 🤟
- Closed Fist ✊

## Debugging Tips

### Camera Not Working
- Ensure browser has camera permissions
- Check that you're accessing via HTTPS or localhost
- Try refreshing the page

### Chat Not Responding
- Verify `OPENAI_API_KEY` is set in Replit Secrets
- Check backend logs for API errors
- Ensure OpenAI account has available credits

### MediaPipe Not Loading
- Check internet connection (CDN required)
- Refresh the page to reinitialize
- Check browser console for errors

## Future Enhancements

### Potential Upgrades
- [ ] Gesture vocabulary expansion with custom ML model
- [ ] Emotion journaling using localStorage or database
- [ ] Text-to-sign visual feedback with animations/GIFs
- [ ] Multi-language support for chat
- [ ] Voice input for chat (speech-to-text)
- [ ] Chat history persistence
- [ ] User authentication
- [ ] Dark mode toggle
- [ ] Export chat transcripts

### Accessibility Improvements
- [ ] Keyboard navigation enhancements
- [ ] Screen reader optimization
- [ ] High contrast mode
- [ ] Font size controls

## Deployment

The application is configured to run on Replit:
- Workflow: "EmpathAI" runs `node index.js`
- Port 5000 serves both backend API and frontend
- Frontend auto-built with `npm run build`
- Hot reload not enabled in production (use `vite dev` for development)

## User Preferences
- Keep code clean and well-commented
- Maintain responsive design principles
- Prioritize accessibility and user experience
- Use modern React patterns (hooks, functional components)
