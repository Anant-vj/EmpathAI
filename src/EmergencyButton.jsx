import React, { useState } from 'react';
import { useTheme } from './ThemeContext';

function EmergencyButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const { isDark } = useTheme();

  const handleEmergencyCall = () => {
    const emergencyContact = localStorage.getItem('emergencyContact');
    if (emergencyContact) {
      window.location.href = `tel:${emergencyContact}`;
    } else {
      alert('Please set up an emergency contact in Settings first.');
    }
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-6 left-6 w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Emergency Call"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-2xl p-6 max-w-sm w-full ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white'}`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Emergency Call?</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                This will call your emergency contact immediately.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleEmergencyCall}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Call Now
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmergencyButton;
