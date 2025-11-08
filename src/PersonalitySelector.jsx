import React from 'react';
import { useTheme } from './ThemeContext';

const PERSONALITIES = [
  {
    id: 'listener',
    name: 'Soft Listener',
    icon: '👂',
    description: 'Gentle, patient, and attentive',
    prompt: 'You are a gentle, patient listener who validates emotions without judgment. Speak softly and compassionately.'
  },
  {
    id: 'coach',
    name: 'Encouraging Coach',
    icon: '💪',
    description: 'Motivating and action-oriented',
    prompt: 'You are an encouraging coach who motivates and empowers. Provide actionable advice with enthusiasm.'
  },
  {
    id: 'counselor',
    name: 'Calm Counselor',
    icon: '🧘',
    description: 'Wise, calm, and balanced',
    prompt: 'You are a calm counselor who provides balanced wisdom. Offer thoughtful perspectives and coping strategies.'
  }
];

function PersonalitySelector({ currentPersonality, onSelect, onClose }) {
  const { isDark } = useTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`rounded-2xl shadow-2xl max-w-md w-full ${
        isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
      }`}>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">🧬 MindMate Personality</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {PERSONALITIES.map(personality => (
            <button
              key={personality.id}
              onClick={() => {
                onSelect(personality);
                onClose();
              }}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                currentPersonality?.id === personality.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl">{personality.icon}</span>
                <span className="font-bold text-lg">{personality.name}</span>
              </div>
              <p className={`text-sm ${
                currentPersonality?.id === personality.id 
                  ? 'text-white/90' 
                  : isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {personality.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { PERSONALITIES };
export default PersonalitySelector;
