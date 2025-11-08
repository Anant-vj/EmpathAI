import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import MobileTranslator from './MobileTranslator';
import FloatingMindMate from './FloatingMindMate';
import EmergencyButton from './EmergencyButton';
import Settings from './Settings';
import MobileProfileSetup from './MobileProfileSetup';
import LearningMode from './LearningMode';
import TextToSignTranslator from './TextToSignTranslator';

function AppContent() {
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLearning, setShowLearning] = useState(false);
  const [showTextToSign, setShowTextToSign] = useState(false);
  const [emotionalMessage, setEmotionalMessage] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const { isDark } = useTheme();

  const handleWellnessPrompt = (message) => {
    setEmotionalMessage(`I just said: "${message}". Can you help me?`);
  };

  const handleProfileSave = (profile) => {
    setUserProfile(profile);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
      {/* Top Bar */}
      <div className={`fixed top-0 left-0 right-0 z-40 ${
        isDark ? 'bg-gray-800/95 border-b border-gray-700' : 'bg-white/95 border-b border-gray-200'
      } backdrop-blur-sm`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>EmpathAI</h1>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>AI Communication Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowLearning(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Learning Mode"
              title="ASL/ISL Learning"
            >
              <span className="text-2xl">📖</span>
            </button>
            <button
              onClick={() => setShowProfile(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Profile Setup"
            >
              <svg className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Settings"
            >
              <svg className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-6 space-y-6">
        <div className="container mx-auto px-4 max-w-4xl">
          <TextToSignTranslator />
        </div>
        <MobileTranslator onWellnessPrompt={handleWellnessPrompt} />
      </div>

      {/* Floating Components */}
      <FloatingMindMate initialMessage={emotionalMessage} />
      <EmergencyButton />

      {/* Modals */}
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <MobileProfileSetup
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        onSave={handleProfileSave}
      />
      {showLearning && (
        <LearningMode onClose={() => setShowLearning(false)} />
      )}
    </div>
  );
}

function MobileApp() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default MobileApp;
