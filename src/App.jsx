import React, { useState } from 'react';
import EnhancedTranslator from './EnhancedTranslator';
import Chat from './Chat';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">💎 EmpathAI</h1>
          <p className="text-indigo-100">Your AI-Powered Communication & Support Companion</p>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-4 px-6 font-medium transition-colors ${
              activeTab === 'chat'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            💬 MindMate Chat
          </button>
          <button
            onClick={() => setActiveTab('translator')}
            className={`flex-1 py-4 px-6 font-medium transition-colors ${
              activeTab === 'translator'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            🤟 Sign Language Translator
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'chat' ? <Chat /> : <EnhancedTranslator />}
        </div>
      </div>
    </div>
  );
}

export default App;
