import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

function EmergencyButton() {
  const [showDialog, setShowDialog] = useState(false);
  const [contacts, setContacts] = useState({ primary: null, secondary: null });
  const { isDark } = useTheme();

  useEffect(() => {
    const saved = localStorage.getItem('emergencyContacts');
    if (saved) {
      setContacts(JSON.parse(saved));
    }
  }, []);

  const handleCall = (contact) => {
    if (contact && contact.phone) {
      window.location.href = `tel:${contact.phone}`;
      setShowDialog(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Emergency Call"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </button>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-2xl shadow-2xl max-w-sm w-full p-6`}>
            <h2 className="text-2xl font-bold mb-4 text-red-600">Emergency Call</h2>
            
            {!contacts.primary && !contacts.secondary ? (
              <div className="text-center py-4">
                <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  No emergency contacts set. Please configure them in Settings.
                </p>
                <button
                  onClick={() => setShowDialog(false)}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.primary && (
                  <button
                    onClick={() => handleCall(contacts.primary)}
                    className="w-full p-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-between"
                  >
                    <div className="text-left">
                      <div className="font-semibold">{contacts.primary.name}</div>
                      <div className="text-sm opacity-90">{contacts.primary.phone}</div>
                    </div>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                )}
                
                {contacts.secondary && (
                  <button
                    onClick={() => handleCall(contacts.secondary)}
                    className="w-full p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center justify-between"
                  >
                    <div className="text-left">
                      <div className="font-semibold">{contacts.secondary.name}</div>
                      <div className="text-sm opacity-90">{contacts.secondary.phone}</div>
                    </div>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                )}
                
                <button
                  onClick={() => setShowDialog(false)}
                  className={`w-full p-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg transition-colors`}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default EmergencyButton;
