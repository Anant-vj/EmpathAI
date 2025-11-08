import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeContext';

function FloatingMindMate({ initialMessage = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m MindMate, your AI companion. I\'m here to support you emotionally. How are you feeling?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (initialMessage && isOpen) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (customMessage = null) => {
    const messageText = customMessage || input.trim();
    if (!messageText || loading) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, I\'m having trouble connecting. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50 ${
            isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
          }`}
          aria-label="Open MindMate"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
        </button>
      )}

      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-full max-w-sm sm:max-w-md md:w-96 h-[85vh] max-h-[600px] rounded-2xl shadow-2xl flex flex-col z-50 mx-4 sm:mx-0 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">MindMate</h3>
                <p className="text-indigo-100 text-xs">Your AI Companion</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : msg.isError
                      ? 'bg-red-100 text-red-800'
                      : isDark
                      ? 'bg-gray-800 text-gray-100 border border-gray-700'
                      : 'bg-white text-gray-800 shadow'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.role === 'user' ? 'text-indigo-200' : isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className={`rounded-2xl px-4 py-2 ${isDark ? 'bg-gray-800' : 'bg-white shadow'}`}>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={`p-4 border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your feelings..."
                className={`flex-1 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                  isDark ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-300'
                } border`}
                rows="2"
                disabled={loading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || loading}
                className="bg-indigo-600 text-white px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors self-end"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingMindMate;
