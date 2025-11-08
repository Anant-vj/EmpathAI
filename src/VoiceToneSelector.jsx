import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

function VoiceToneSelector({ currentVoice, onSelect, onClose }) {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      
      const voiceCategories = {
        friendly: availableVoices.find(v => 
          v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria')
        ) || availableVoices[0],
        professional: availableVoices.find(v => 
          v.name.includes('Alex') || v.name.includes('Daniel') || v.name.includes('Male')
        ) || availableVoices[1] || availableVoices[0],
        calm: availableVoices.find(v => 
          v.name.includes('Karen') || v.name.includes('Serena') || v.name.includes('UK')
        ) || availableVoices[2] || availableVoices[0]
      };

      setVoices([
        { id: 'friendly', name: 'Friendly & Warm', voiceName: voiceCategories.friendly?.name, pitch: 1.2, rate: 1.0, icon: '😊' },
        { id: 'professional', name: 'Professional & Clear', voiceName: voiceCategories.professional?.name, pitch: 1.0, rate: 0.95, icon: '💼' },
        { id: 'calm', name: 'Calm & Soothing', voiceName: voiceCategories.calm?.name, pitch: 0.9, rate: 0.85, icon: '🧘' }
      ]);
    };

    loadVoices();
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const testVoice = (voiceConfig) => {
    const utterance = new SpeechSynthesisUtterance('Hello! This is how I sound.');
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.name === voiceConfig.voiceName);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.pitch = voiceConfig.pitch;
    utterance.rate = voiceConfig.rate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleSelect = (voiceConfig) => {
    setSelectedVoice(voiceConfig);
    const saveConfig = {
      id: voiceConfig.id,
      name: voiceConfig.name,
      voiceName: voiceConfig.voiceName,
      pitch: voiceConfig.pitch,
      rate: voiceConfig.rate,
      icon: voiceConfig.icon
    };
    localStorage.setItem('selectedVoice', JSON.stringify(saveConfig));
    onSelect(saveConfig);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              🗣️ Voice Tone
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose how the AI should speak to you
          </p>
        </div>

        <div className="p-6 space-y-3">
          {voices.map((voiceConfig) => (
            <div
              key={voiceConfig.id}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                selectedVoice?.id === voiceConfig.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : isDark
                    ? 'border-gray-700 hover:border-gray-600 bg-gray-700'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}
              onClick={() => handleSelect(voiceConfig)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{voiceConfig.icon}</span>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                      {voiceConfig.name}
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {voiceConfig.voiceName || 'Default'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    testVoice(voiceConfig);
                  }}
                  className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoiceToneSelector;
