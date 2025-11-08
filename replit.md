# 💎 EmpathAI - Mobile-First Sign Language & Wellness Companion

## Overview
EmpathAI is a mobile-first web application designed for hearing-impaired users, featuring:
1. **Real-Time Sign Language Translation** - MediaPipe-powered gesture recognition with speech output
2. **Floating MindMate Chat** - Empathetic AI companion accessible from anywhere (GPT-4o-mini)
3. **Sentiment Detection & Wellness** - Detects negative emotions and offers AI support
4. **Emergency Features** - Quick-access emergency calling with customizable contacts
5. **Auto-Response Mode** - AI handles greetings/introductions automatically
6. **Dark/Light Theme** - Accessible design with theme switching

**Current State**: ✅ Production-ready mobile-first application
**Last Updated**: November 8, 2025 (Major mobile redesign)

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
├── index.js                        # Express backend server (OpenAI chat API)
├── package.json                    # Dependencies + scripts
├── vite.config.js                  # Vite bundler config
├── tailwind.config.js              # TailwindCSS with dark mode
├── postcss.config.js               # PostCSS config
├── index.html                      # HTML entry point
├── dist/                           # Built frontend (generated)
└── src/
    ├── index.jsx                   # React entry point (renders MobileApp)
    ├── MobileApp.jsx               # Mobile-first single-page layout
    ├── MobileTranslator.jsx        # Enhanced sign translator (main screen)
    ├── FloatingMindMate.jsx        # Bottom-right chat widget
    ├── ThemeContext.jsx            # Dark/light theme provider
    ├── Settings.jsx                # Top-right settings panel
    ├── SentimentDetector.js        # Emotion keyword detection
    ├── MobileProfileSetup.jsx      # Streamlined profile setup
    ├── EmergencyButton.jsx         # Emergency call button component
    └── styles.css                  # Global styles + Tailwind
```

## 🌟 Mobile-First Features

### 1. Floating MindMate Chat Widget 💬
- **Bottom-Right Widget**: Always accessible purple chat button with green online indicator
- **Expandable Interface**: Click to expand full chat (minimize to continue translating)
- **Empathetic AI**: GPT-4o-mini trained for compassionate, supportive responses
- **Auto-scroll**: Latest messages automatically visible
- **Wellness Integration**: Triggered by sentiment detection for mental health support
- **Custom Branding**: Unique purple chat logo differentiates from main app logo

### 2. Sign Language Translation System 🤟

#### Real-Time Gesture Recognition (MediaPipe)
- **Pretrained Gestures**: Thumbs Up 👍, Victory ✌️, Open Palm ✋, Pointing Up ☝️, ILoveYou 🤟, Closed Fist ✊
- **GPU/CPU Fallback**: Automatically switches to CPU if WebGL unavailable
- **Hand Tracking**: Supports up to 2 hands simultaneously
- **Visual Feedback**: Hand landmarks overlaid on video feed
- **Speech Output**: Text-to-speech for detected gestures
- **Mobile-Optimized**: Responsive camera controls and large buttons

#### Sentiment-Aware Translation
- **Emotion Detection**: Analyzes sign language text for negative sentiments
- **Keywords**: Sad, angry, frustrated, lonely, scared, anxious, depressed, hopeless, lost
- **Wellness Triggers**: Opens MindMate chat when negative emotions detected
- **AI Support**: Empathetic prompts like "I noticed you might be feeling down. Want to talk?"

### 3. Auto-Response Mode 🤖

#### Simplified Profile Setup
- **Required Fields**: Name only (for personalization)
- **Optional Fields**: About me, custom greeting, custom introduction
- **Quick Setup**: Minimal friction for new users
- **localStorage Persistence**: Privacy-first local storage

#### Automatic Conversation Handling
When enabled, AI responds automatically to:
- **Greetings** (hello, hi gestures) → Speaks custom greeting or default
- **Introductions** (introduce, meet gestures) → Introduces user with profile details
- **Gratitude** (thanks, thank you) → "You're welcome"
- **Help Requests** (help, assist) → "How can I help you?"

### 4. Emergency Features 🆘

#### Quick-Access Emergency Button
- **Bottom-Left Corner**: Red phone icon for instant emergency calls
- **One-Tap Access**: No nested menus during emergencies
- **Mobile-Optimized**: Large, easy-to-tap button

#### Emergency Contacts Management (Settings)
- **Primary Contact**: Main emergency contact (name + phone)
- **Secondary Contact**: Backup contact
- **Quick Dial**: Tap emergency button to choose contact to call
- **localStorage**: Contacts saved locally for privacy

### 5. Dark/Light Theme System 🌓

#### Theme Context Provider
- **React Context API**: Global theme state management
- **localStorage Persistence**: Theme preference saved across sessions
- **Tailwind Dark Mode**: Uses class-based dark mode strategy
- **Font Color Adaptation**: Text colors adjust for readability in both themes

#### Theme Toggle (Settings Panel)
- **Top-Right Settings**: Gear icon opens settings modal
- **Toggle Switch**: Visual switch for dark/light mode
- **Instant Apply**: No page refresh required
- **Accessible**: High contrast in both themes

### 6. Mobile-First Design & UX
- **Single-Page Layout**: No tabs, streamlined for mobile screens
- **Fixed Position Controls**: Emergency + MindMate always accessible
- **Large Touch Targets**: Buttons optimized for finger taps
- **Gradient UI**: Beautiful indigo/purple theme with accessibility
- **Responsive**: Works on phones, tablets, and desktops
- **Loading States**: Clear feedback for all async operations
- **Error Handling**: User-friendly error messages with recovery suggestions

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
