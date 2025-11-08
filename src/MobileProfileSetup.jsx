import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

function MobileProfileSetup({ onClose, onSave }) {
  const [profile, setProfile] = useState({
    name: '',
    greeting: '',
    introduction: '',
    about: '',
    occupation: ''
  });
  const { isDark } = useTheme();

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    if (!profile.name || !profile.greeting) {
      alert('Please fill in required fields (Name and Greeting)');
      return;
    }
    localStorage.setItem('userProfile', JSON.stringify(profile));
    onSave(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">👤 Setup Profile</h2>
              <p className="text-indigo-100 text-sm">Configure auto-response settings</p>
            </div>
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

        <div className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="e.g., Sarah Johnson"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Custom Greeting <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profile.greeting}
              onChange={(e) => setProfile({ ...profile, greeting: e.target.value })}
              placeholder="e.g., Hello! Nice to meet you!"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              ✨ Optional Information
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Fill these to provide richer auto-responses
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Occupation (Optional)
            </label>
            <input
              type="text"
              value={profile.occupation}
              onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
              placeholder="e.g., Teacher, Engineer, Student"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              About You (Optional)
            </label>
            <textarea
              value={profile.about}
              onChange={(e) => setProfile({ ...profile, about: e.target.value })}
              placeholder="e.g., I love reading and hiking..."
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'
              }`}
              rows="3"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Custom Introduction (Optional)
            </label>
            <textarea
              value={profile.introduction}
              onChange={(e) => setProfile({ ...profile, introduction: e.target.value })}
              placeholder="e.g., My name is [name]. I work as a [occupation]..."
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'
              }`}
              rows="3"
            />
          </div>

          <div className={`p-4 rounded-lg border ${
            isDark ? 'bg-indigo-900/30 border-indigo-700' : 'bg-blue-50 border-blue-200'
          }`}>
            <p className={`text-sm ${isDark ? 'text-indigo-200' : 'text-blue-800'}`}>
              <strong>💡 How it works:</strong> MindMate will use this information to automatically
              greet and introduce you when auto-response mode is enabled.
            </p>
          </div>
        </div>

        <div className={`p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileProfileSetup;
