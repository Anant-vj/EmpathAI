import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeContext'; // Removed GestureRecognizer imports

const ASL_VOCABULARY = [
  { word: 'A (Letter)', gesture: 'Closed_Fist', description: 'Closed fist with thumb to the side', emoji: '✊' },
  { word: 'B (Letter)', gesture: 'Open_Palm', description: 'Open palm, fingers together', emoji: '✋' },
  { word: 'Number 1', gesture: 'Pointing_Up', description: 'Index finger pointing up', emoji: '☝️' },
  { word: 'Number 2', gesture: 'Victory', description: 'Index and middle finger extended (peace sign)', emoji: '✌️' },
  { word: 'Number 5', gesture: 'Open_Palm', description: 'All five fingers extended', emoji: '🖐️' },
  { word: 'Hello/Hi', gesture: 'Open_Palm', description: 'Open palm waving motion', emoji: '👋' },
  { word: 'Thank You', gesture: 'Open_Palm', description: 'Open palm from chin outward', emoji: '🙏' },
  { word: 'I Love You', gesture: 'ILoveYou', description: 'Thumb, index, and pinky extended', emoji: '🤟' },
  { word: 'Good/Thumbs Up', gesture: 'Thumb_Up', description: 'Thumbs up gesture', emoji: '👍' },
  { word: 'Yes/Agree', gesture: 'Closed_Fist', description: 'Fist nodding motion', emoji: '✊' },
  { word: 'Help/Support', gesture: 'Thumb_Up', description: 'Thumbs up on open palm', emoji: '🤝' },
  { word: 'Please/Request', gesture: 'Open_Palm', description: 'Open palm circling chest', emoji: '🙏' },
  { word: 'Sorry/Apologize', gesture: 'Closed_Fist', description: 'Fist circling over heart', emoji: '😔' },
  { word: 'Peace/Victory', gesture: 'Victory', description: 'Peace sign / V shape', emoji: '✌️' },
  { word: 'Stop/Wait', gesture: 'Open_Palm', description: 'Open palm facing forward', emoji: '✋' }
];

// 🟩 NEW: Simple multiple-choice questions (replaces gesture recognition)
const QUIZ_QUESTIONS = [
  {
    question: "What does the ✊ (Closed Fist) gesture mean?",
    options: ["A", "B", "Yes/Agree", "Peace"],
    answer: "Yes/Agree"
  },
  {
    question: "Which sign means 'Thank You'?",
    options: ["Open Palm from Chin", "Victory Sign", "Thumbs Up", "Fist"],
    answer: "Open Palm from Chin"
  },
  {
    question: "What gesture represents 'I Love You'?",
    options: ["🤟", "✋", "✌️", "✊"],
    answer: "🤟"
  },
  {
    question: "What does ✌️ usually mean?",
    options: ["Victory/Peace", "Stop", "Help", "Goodbye"],
    answer: "Victory/Peace"
  }
];

function LearningMode({ onClose }) {
  const [mode, setMode] = useState('menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const { isDark } = useTheme();

  const handleFlashcardNext = () => {
    if (currentIndex < ASL_VOCABULARY.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setFeedback('');
    } else {
      setMode('menu');
      setCurrentIndex(0);
    }
  };

  // 🟩 UPDATED: simple quiz logic without camera
  const handleQuizSubmit = () => {
    const currentQuestion = QUIZ_QUESTIONS[currentIndex];
    setIsChecking(true);

    setTimeout(() => {
      if (userAnswer === currentQuestion.answer) {
        setFeedback('✅ Correct! Well done!');
        setScore(score + 1);
      } else {
        setFeedback(`❌ Incorrect. The correct answer is: ${currentQuestion.answer}`);
      }
      setIsChecking(false);
    }, 400);
  };

  const handleQuizNext = () => {
    setFeedback('');
    setUserAnswer('');

    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert(`Quiz Complete! Your score: ${score}/${QUIZ_QUESTIONS.length}`);
      setMode('menu');
      setCurrentIndex(0);
      setScore(0);
    }
  };

  const renderMenu = () => (
    <div className="text-center py-8">
      <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
        📖 ASL/ISL Learning Mode
      </h2>
      <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        Practice sign language with interactive games!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setMode('flashcard')}
          className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
        >
          <div className="text-4xl mb-2">🎴</div>
          <h3 className="text-xl font-bold mb-2">Flashcards</h3>
          <p className="text-sm opacity-90">Learn signs and their meanings</p>
        </button>

        <button
          onClick={() => { setMode('quiz'); setScore(0); }}
          className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
        >
          <div className="text-4xl mb-2">🎯</div>
          <h3 className="text-xl font-bold mb-2">Quiz Mode</h3>
          <p className="text-sm opacity-90">Test your sign language skills</p>
        </button>
      </div>
    </div>
  );

  const renderFlashcard = () => {
    const currentCard = ASL_VOCABULARY[currentIndex];
    return (
      <div className="py-6">
        <div className="text-center mb-6">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Card {currentIndex + 1} of {ASL_VOCABULARY.length}
          </span>
        </div>

        <div className={`p-8 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gradient-to-br from-indigo-50 to-purple-50'} mb-6`}>
          <div className="text-6xl mb-4 text-center">{currentCard.emoji}</div>
          <h3 className={`text-3xl font-bold text-center mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {currentCard.word}
          </h3>
          <p className={`text-center mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <strong>Gesture:</strong> {currentCard.gesture}
          </p>
          <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentCard.description}
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${currentIndex === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
          >
            ← Previous
          </button>

          <button
            onClick={handleFlashcardNext}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            {currentIndex < ASL_VOCABULARY.length - 1 ? 'Next →' : 'Finish'}
          </button>
        </div>
      </div>
    );
  };

  // 🟩 NEW: Question-based quiz renderer (replaces camera)
  const renderQuiz = () => {
    const currentQuestion = QUIZ_QUESTIONS[currentIndex];
    return (
      <div className="py-6">
        <div className="text-center mb-6">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Question {currentIndex + 1} of {QUIZ_QUESTIONS.length} | Score: {score}
          </span>
        </div>

        <div className={`p-8 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-50 to-pink-50'} mb-6`}>
          <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {currentQuestion.question}
          </h3>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, i) => (
              <button
                key={i}
                onClick={() => setUserAnswer(option)}
                className={`w-full p-3 rounded-lg border text-left ${userAnswer === option
                    ? 'bg-purple-600 text-white'
                    : isDark
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={handleQuizSubmit}
            disabled={!userAnswer || isChecking}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {isChecking ? 'Checking...' : '✓ Submit Answer'}
          </button>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-lg mb-4 ${feedback.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
          >
            {feedback}
          </div>
        )}

        {feedback && (
          <button
            onClick={handleQuizNext}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            {currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'Finish Quiz'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
          }`}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Learning Mode</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {mode === 'menu' && renderMenu()}
          {mode === 'flashcard' && renderFlashcard()}
          {mode === 'quiz' && renderQuiz()}

          {mode !== 'menu' && (
            <button
              onClick={() => { setMode('menu'); setCurrentIndex(0); setFeedback(''); }}
              className={`w-full mt-4 px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              ← Back to Menu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LearningMode;
