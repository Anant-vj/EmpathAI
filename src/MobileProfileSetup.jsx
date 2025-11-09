import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

function MobileProfileSetup({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    greeting: '',
    introduction: ''
  });
  const { isDark } = useTheme();

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify(formData));
    localStorage.setItem('autoResponseEnabled', 'true');
    if (onSave) onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} px-6 py-4 flex justify-between items-center`}>
          <h2 className="text-2xl font-bold">Profile Setup</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              About Me <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <textarea
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="Tell me about yourself..."
              rows="3"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Custom Greeting <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.greeting}
              onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="e.g., Hello! Nice to meet you!"
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              What should I say when someone greets you?
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Custom Introduction <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <textarea
              value={formData.introduction}
              onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="e.g., This is [name], they enjoy..."
              rows="3"
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              How should I introduce you to others? Use [name] as placeholder.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-lg ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              } transition-colors font-medium`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium shadow-lg"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MobileProfileSetup;
