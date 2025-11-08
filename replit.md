# 💎 EmpathAI - Mobile-First Sign Language & Wellness Companion

## Overview
EmpathAI is a mobile-first web application designed for hearing-impaired users, focusing on real-time sign language translation and empathetic AI companionship. Its core purpose is to bridge communication gaps and provide mental wellness support. Key capabilities include:

- **Real-Time Sign Language Translation**: Uses MediaPipe for gesture recognition, converting signs into speech output.
- **Floating MindMate Chat**: An empathetic AI (GPT-4o-mini) accessible across the application for emotional support.
- **Sentiment Detection & Wellness**: Identifies negative emotions in sign language input and offers AI-driven support.
- **Emergency Features**: Quick-access emergency calling with customizable contacts.
- **Auto-Response Mode**: AI handles common greetings and introductions based on gestures and user profiles.
- **Accessible Design**: Features a dark/light theme and mobile-first UX.

EmpathAI aims to empower hearing-impaired individuals with enhanced communication tools and a supportive digital companion, thereby improving their daily interactions and mental well-being.

## User Preferences
- Keep code clean and well-commented
- Maintain responsive design principles
- Prioritize accessibility and user experience
- Use modern React patterns (hooks, functional components)
- Store data locally for privacy
- Provide clear user feedback and error messages

## System Architecture

### Tech Stack
- **Backend**: Node.js, Express.js, OpenAI SDK (GPT-4o-mini)
- **Frontend**: React, Vite, TailwindCSS
- **AI/ML**: OpenAI GPT-4o-mini, MediaPipe Hands (pretrained gesture recognition), TensorFlow.js (custom gesture classification), Web Speech API (text-to-speech)
- **Storage**: localStorage (profiles, custom gestures)
- **Deployment**: Unified backend + frontend on Port 5000.

### UI/UX Decisions
- **Mobile-First Design**: Streamlined single-page layout with fixed-position controls (Emergency Button, MindMate Chat) for optimal mobile interaction.
- **Accessibility**: Dark/light theme switching, large touch targets, high contrast, and gradient UI for visual appeal and readability.
- **MindMate Widget**: A persistently accessible, expandable chat widget with custom branding (purple chat logo).
- **User Feedback**: Clear loading states and user-friendly error messages.

### Technical Implementations & Feature Specifications
- **Real-Time Gesture Recognition**: Utilizes MediaPipe for pretrained gestures and a custom TensorFlow.js-based algorithm for user-trained gestures (Euclidean distance-based classification). Supports up to two hands and provides visual feedback.
- **Sentiment-Aware Translation**: Integrates emotion detection to trigger MindMate support upon identifying negative sentiments in translated text.
- **Auto-Response System**: Maps MediaPipe gestures to keywords for context-aware AI responses, leveraging user profile data for personalization. Includes simplified profile setup (name, about, greeting, introduction).
- **Emergency Features**: One-tap emergency calling via a prominently placed button, with configurable primary and secondary contacts stored locally.
- **Theme System**: Global theme management via React Context API, persistent storage in localStorage, and Tailwind CSS class-based dark mode.
- **Voice Tone Selector**: Offers three voice presets (Friendly & Warm, Professional & Clear, Calm & Soothing) with customizable pitch/rate, saved persistently using Web Speech API.
- **Tenor API Integration**: Secure backend proxy for GIF-based ASL/ISL translations, replacing Giphy for cost-effectiveness and rate limit freedom.
- **Expanded ASL/ISL Vocabulary**: Includes 15 unique gestures covering letters, numbers, and common phrases with visual emojis.

### System Design Choices
- **Hybrid Gesture Recognition**: Combines MediaPipe's pretrained models with custom TensorFlow.js models for comprehensive and flexible sign language interpretation.
- **Privacy-First Local Storage**: All user profiles, custom gestures, and preferences are stored client-side in localStorage.
- **Empathetic AI Integration**: GPT-4o-mini is central to MindMate, providing compassionate and supportive interactions, triggered by sentiment detection.
- **Unified Backend/Frontend**: A single Node.js Express server handles both API requests and serves the React frontend.

## External Dependencies

- **OpenAI API**: For GPT-4o-mini, enabling empathetic chat functionality via `OPENAI_API_KEY`.
- **Tenor API**: For fetching ASL/ISL GIF animations for text-to-sign translation, integrated via a backend proxy with `TENOR_API_KEY`.
- **MediaPipe Hands**: Google's machine learning solution for real-time hand and finger tracking, used for sign language gesture recognition.
- **TensorFlow.js**: Used for client-side custom gesture classification, enabling users to train and recognize their own signs.
- **Web Speech API**: Browser-native API for text-to-speech functionality, used for vocalizing translated signs and AI responses.