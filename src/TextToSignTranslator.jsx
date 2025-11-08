import React, { useState } from 'react';
import { useTheme } from './ThemeContext';

function TextToSignTranslator() {
  const [inputText, setInputText] = useState('');
  const [signImages, setSignImages] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { isDark } = useTheme();

  const translateToSigns = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    const words = inputText.trim().split(/\s+/);
    
    const signPromises = words.map(async (word) => {
      const giphyKey = process.env.GIPHY_API_KEY || 'demo_api_key';
      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=ASL+sign+language+${word}&limit=1&rating=g`
        );
        const data = await response.json();
        
        if (data.data && data.data[0]) {
          return {
            word,
            gifUrl: data.data[0].images.fixed_height.url
          };
        }
        return { word, gifUrl: null };
      } catch (error) {
        console.error(`Error fetching sign for ${word}:`, error);
        return { word, gifUrl: null };
      }
    });

    const results = await Promise.all(signPromises);
    setSignImages(results);
    setIsTranslating(false);
    
    navigator.vibrate && navigator.vibrate(200);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
      <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
        🗣️ Speech/Text to Sign Language
      </h2>
      
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && translateToSigns()}
            placeholder="Type a sentence or use voice input..."
            className={`flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
              isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'
            }`}
          />
          <button
            onClick={startVoiceInput}
            disabled={isListening}
            className={`px-4 py-3 rounded-lg transition-all ${
              isListening 
                ? 'bg-red-600 animate-pulse' 
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white font-medium`}
          >
            {isListening ? '🎤 Listening...' : '🎤'}
          </button>
        </div>
        
        <button
          onClick={translateToSigns}
          disabled={isTranslating || !inputText.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:from-gray-400 disabled:to-gray-400"
        >
          {isTranslating ? 'Translating...' : '✨ Translate to Signs'}
        </button>
      </div>

      {signImages.length > 0 && (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            Sign Language Translation:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {signImages.map((item, index) => (
              <div key={index} className={`p-3 rounded-lg text-center ${
                isDark ? 'bg-gray-600' : 'bg-white'
              }`}>
                <p className={`font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {item.word}
                </p>
                {item.gifUrl ? (
                  <img 
                    src={item.gifUrl} 
                    alt={`Sign for ${item.word}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className={`h-32 flex items-center justify-center rounded ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <span className="text-3xl">🤟</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className={`text-xs mt-3 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Powered by GIPHY
          </p>
        </div>
      )}
    </div>
  );
}

export default TextToSignTranslator;
