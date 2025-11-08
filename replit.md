# 💎 EmpathAI - Enhanced Sign Language Translator & AI Companion

## Overview
EmpathAI is an advanced full-stack web application combining:
1. **Enhanced Sign Language Translator** - Real-time gesture detection with custom training capabilities
2. **MindMate Chat** - Empathetic AI companion with auto-response mode
3. **Custom Gesture Training** - Train your own sign language gestures
4. **Auto-Response System** - AI handles conversations automatically for hearing-impaired users

**Current State**: ✅ Fully functional with enhanced AI features
**Last Updated**: November 8, 2025

## Project Architecture

### Tech Stack
- **Backend**: Node.js + Express.js + OpenAI SDK (GPT-4o-mini)
- **Frontend**: React + Vite + TailwindCSS
- **AI/ML**: 
  - OpenAI GPT-4o-mini (empathetic chat)
  - MediaPipe Hands (pretrained gesture recognition)
  - TensorFlow.js (custom gesture classification)
  - Web Speech API (text-to-speech)
- **Storage**: localStorage (profiles, custom gestures)
- **Port**: 5000 (unified backend + frontend)

### Project Structure
```
/
├── index.js                        # Express backend server
├── package.json                    # Dependencies + scripts
├── vite.config.js                  # Vite bundler config
├── tailwind.config.js              # TailwindCSS styling
├── postcss.config.js               # PostCSS config
├── index.html                      # HTML entry point
├── dist/                           # Built frontend (generated)
└── src/
    ├── index.jsx                   # React entry point
    ├── App.jsx                     # Main app with tab switcher
    ├── Chat.jsx                    # MindMate chat component
    ├── EnhancedTranslator.jsx      # Enhanced sign translator
    ├── CustomGestureTrainer.jsx    # Gesture training UI
    ├── ProfileSetup.jsx            # User profile configuration
    └── styles.css                  # Global styles + Tailwind
```

## 🌟 Enhanced Features

### 1. MindMate Chat 💬
- Real-time empathetic AI responses using GPT-4o-mini
- Auto-response mode for automatic conversations
- Clean, responsive chat interface with message history
- Timestamp tracking and error handling
- Auto-scroll to latest messages
- Loading states with animated indicators

### 2. Enhanced Sign Language Translator 🤟

#### Pretrained Gesture Recognition (MediaPipe)
- Thumbs Up 👍, Victory ✌️, Open Palm ✋
- Pointing Up ☝️, ILoveYou 🤟, Closed Fist ✊
- Real-time hand landmark tracking (2 hands supported)
- Visual overlay on video feed
- Confidence score display

#### Custom Gesture Training 🎓
- **Record Custom Gestures**: 3-second video recordings
- **Hand Landmark Extraction**: Uses MediaPipe landmarks
- **Gesture Storage**: Saved to localStorage
- **Management UI**: View, delete custom gestures
- **Sample Tracking**: Shows number of samples per gesture

#### Hybrid Recognition System
- **Dual Detection**: Pretrained + custom gestures
- **Euclidean Distance Matching**: For custom gestures
- **Priority System**: Custom gestures checked first
- **Confidence Threshold**: 70% minimum for speaking
- **Speech Synthesis**: Speaks detected gestures aloud

### 3. Auto-Response Mode 🤖

#### Profile System
- **User Information**: Name, about, occupation
- **Custom Greetings**: Personalized hello messages
- **Custom Introductions**: Auto-generated introductions
- **localStorage Persistence**: Profiles saved locally

#### Automatic Conversation Handling
When auto-response mode is enabled:
- Detects greeting gestures → speaks custom greeting
- Detects introduction gestures → introduces user automatically
- Detects "thanks" gestures → responds with "You're welcome"
- Detects "help" gestures → offers assistance
- **AI Integration**: Can escalate to GPT-4o-mini for follow-up responses

#### Conversation History
- Tracks recent auto-responses
- Displays last 3 interactions
- Shows gesture → response mapping
- Timestamp tracking

### 4. Design & UX
- Beautiful gradient UI (indigo/purple theme)
- Responsive design (mobile-friendly)
- Tab-based navigation
- Modal dialogs for training and profile setup
- Accessible color contrast
- Smooth animations and transitions
- Loading states and error handling

## Environment Setup

### Required Secrets
- `OPENAI_API_KEY` - OpenAI API key for chat functionality ✅ Configured

### Dependencies
**Backend**:
- express, cors, dotenv, openai

**Frontend**:
- react, react-dom, vite, @vitejs/plugin-react

**AI/ML**:
- @mediapipe/tasks-vision (gesture recognition)
- @tensorflow/tfjs (custom gesture classification)

**Styling**:
- tailwindcss, autoprefixer, postcss

## How It Works

### Backend (index.js)
- Serves React frontend from `/dist`
- `/api/chat` POST endpoint for AI chat responses
- `/api/health` GET endpoint for health checks
- Empathetic system prompt for compassionate responses
- Auto-response integration support
- Comprehensive error handling

### Frontend Components

#### EnhancedTranslator.jsx
- Camera management and video streaming
- MediaPipe gesture recognition integration
- Custom gesture classification (Euclidean distance)
- Auto-response mode toggle
- Profile setup button
- Training mode button
- Conversation history display
- Speech synthesis for detected gestures

#### CustomGestureTrainer.jsx
- Video recording (3-second captures)
- Hand landmark extraction from MediaPipe
- Landmark averaging for stable recognition
- Gesture naming and storage
- Gesture management (view, delete)
- localStorage persistence

#### ProfileSetup.jsx
- User profile configuration
- Name, about, greeting, introduction fields
- localStorage persistence
- Modal dialog UI

## 📚 User Guide

### Setting Up Your Profile

1. Navigate to "Sign Language Translator" tab
2. Click "👤 Setup Profile" button
3. Fill in your information:
   - **Name**: Your full name
   - **About**: Brief description (for introductions)
   - **Greeting**: Custom hello message
   - **Introduction**: Custom introduction template
4. Click "Save Profile"

### Training Custom Gestures

1. Click "🎓 Train Custom Gestures" button
2. Enter a gesture name (e.g., "Hello", "Thank You", "Help")
3. Click "🎥 Record Gesture"
4. Perform the gesture for 3 seconds
5. Gesture is saved automatically
6. Repeat for additional gestures

**Tips for Training**:
- Use clear, distinct hand positions
- Keep hand visible in camera frame
- Good lighting helps accuracy
- Record 2-3 variations of the same gesture for better recognition

### Using Auto-Response Mode

1. Set up your profile first (required)
2. Train custom gestures (optional but recommended)
3. Toggle "🤖 Auto-Response Mode" ON
4. Start camera
5. Perform gestures:
   - **Greeting gestures** → AI speaks your custom greeting
   - **Introduction gestures** → AI introduces you
   - **Thanks gestures** → AI responds appropriately
   - **Help gestures** → AI offers assistance

### Using MindMate Chat

1. Navigate to "💬 MindMate Chat" tab
2. Type your thoughts in the text area
3. Press Enter or click "Send"
4. AI responds with empathetic support

## Testing & Usage

### Testing Enhanced Translator

**Pretrained Gestures**:
1. Click "🎥 Start Camera"
2. Make standard gestures (thumbs up, victory, etc.)
3. Gestures detected and spoken aloud

**Custom Gestures**:
1. Train gestures using the trainer
2. Start camera
3. Perform your custom gestures
4. Should be recognized with "Custom" label

**Auto-Response**:
1. Setup profile
2. Enable auto-response mode
3. Perform greeting/intro gestures
4. AI speaks on your behalf

### Known Pretrained Gestures
- Thumbs Up 👍
- Victory ✌️
- Open Palm ✋
- Pointing Up ☝️
- ILoveYou 🤟
- Closed Fist ✊

## Debugging Tips

### Camera Not Working
- Ensure browser has camera permissions
- Access via HTTPS or localhost
- Check browser console for errors
- Try refreshing the page

### Chat Not Responding
- Verify `OPENAI_API_KEY` is set in Replit Secrets
- Check OpenAI account has available credits
- View backend logs for API errors

### Custom Gestures Not Recognized
- Ensure good lighting
- Keep hand clearly visible
- Train multiple samples of same gesture
- Adjust confidence threshold if needed
- Check that gestures are visually distinct

### Auto-Response Not Working
- Verify profile is set up
- Check auto-response mode is enabled
- Ensure gesture keywords match (hello, greeting, introduce, thanks, help)
- Check conversation history to see if responses were triggered

### MediaPipe Not Loading
- Check internet connection (CDN required)
- Refresh page to reinitialize
- Check browser console for errors

## Technical Details

### Custom Gesture Recognition Algorithm

1. **Recording Phase**:
   - Captures MediaPipe hand landmarks every 100ms for 3 seconds
   - Extracts 21 landmarks × 3 coordinates (x, y, z) = 63 features per frame
   - Stores all frames for the gesture

2. **Training Phase**:
   - Averages all landmark frames to create stable gesture signature
   - Stores averaged landmarks in localStorage
   - Associates with user-defined gesture name

3. **Recognition Phase**:
   - Extracts current hand landmarks from video
   - Calculates Euclidean distance to all trained gestures
   - Selects best match if distance < 0.15 threshold
   - Returns custom gesture name if matched

4. **Hybrid System**:
   - Checks custom gestures first
   - Falls back to MediaPipe pretrained if no custom match
   - Combines results for comprehensive recognition

### Auto-Response Trigger System

- **Keyword Matching**: Checks gesture names for keywords (hello, introduce, greeting, thanks, help)
- **Profile Data**: Uses stored user profile for personalization
- **Speech Pipeline**: Reuses Web Speech API for consistency
- **AI Escalation**: Can call GPT-4o-mini for follow-up responses
- **History Tracking**: Logs all auto-responses for review

## Future Enhancements

### Potential Upgrades
- [ ] Advanced ML model training (neural networks)
- [ ] Video sample storage (not just landmarks)
- [ ] Multi-language support for gestures and chat
- [ ] Database storage (replace localStorage)
- [ ] User authentication and cloud sync
- [ ] Gesture confidence tuning UI
- [ ] Real-time gesture feedback during training
- [ ] Export/import gesture datasets
- [ ] Gesture recognition analytics dashboard
- [ ] Voice input for chat (speech-to-text)
- [ ] Dark mode toggle
- [ ] Accessibility improvements (keyboard nav, screen readers)

### Accessibility Improvements
- [ ] Keyboard navigation for all features
- [ ] Screen reader optimization
- [ ] High contrast mode
- [ ] Adjustable font sizes
- [ ] ARIA labels for complex interactions

## Deployment

The application is configured to run on Replit:
- Workflow: "EmpathAI" runs `node index.js`
- Port 5000 serves both backend API and frontend
- Frontend built with `npm run build`
- Hot reload disabled in production

## User Preferences
- Keep code clean and well-commented
- Maintain responsive design principles
- Prioritize accessibility and user experience
- Use modern React patterns (hooks, functional components)
- Store data locally for privacy
- Provide clear user feedback and error messages
