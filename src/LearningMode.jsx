import React, { useState, useRef, useEffect } from 'react';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';
import { useTheme } from './ThemeContext';

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

function LearningMode({ onClose }) {
  const [mode, setMode] = useState('menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [detectedGesture, setDetectedGesture] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const videoRef = useRef(null);
  const animationFrameRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const initializeGestureRecognizer = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        
        const recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
            delegate: 'CPU'
          },
          runningMode: 'VIDEO',
          numHands: 1
        });
        
        setGestureRecognizer(recognizer);
      } catch (err) {
        console.error('Failed to initialize gesture recognizer:', err);
      }
    };

    initializeGestureRecognizer();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showVideo && gestureRecognizer && !animationFrameRef.current) {
      detectGestures();
    }
  }, [showVideo, gestureRecognizer]);

  const startCamera = async () => {
    if (isStartingCamera) return;
    
    try {
      setIsStartingCamera(true);
      setFeedback('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        try {
          await videoRef.current.play();
          setShowVideo(true);
        } catch (playErr) {
          console.error('Video play error:', playErr);
          setFeedback('❌ Unable to start video. Please try again.');
          stream.getTracks().forEach(track => track.stop());
        }
      }
    } catch (err) {
      console.error('Camera error:', err);
      setFeedback('❌ Unable to access camera. Please allow camera permissions and try again.');
    } finally {
      setIsStartingCamera(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setShowVideo(false);
    setDetectedGesture('');
  };

  const detectGestures = () => {
    if (!gestureRecognizer || !videoRef.current) return;

    const video = videoRef.current;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const results = gestureRecognizer.recognizeForVideo(video, Date.now());
      
      if (results.gestures && results.gestures.length > 0) {
        const gesture = results.gestures[0][0];
        setDetectedGesture(gesture.categoryName);
      }
    }

    animationFrameRef.current = requestAnimationFrame(detectGestures);
  };

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

  const handleQuizSubmit = () => {
    const currentWord = ASL_VOCABULARY[currentIndex];
    setIsChecking(true);

    setTimeout(() => {
      if (detectedGesture.toLowerCase().includes(currentWord.gesture.toLowerCase().split('_')[0])) {
        setFeedback('✅ Correct! Well done!');
        setScore(score + 1);
        
        navigator.vibrate && navigator.vibrate([200, 100, 200]);
      } else {
        setFeedback(`❌ Not quite. Expected: ${currentWord.gesture}`);
        navigator.vibrate && navigator.vibrate(500);
      }
      setIsChecking(false);
      setDetectedGesture('');
    }, 500);
  };

  const handleQuizNext = () => {
    setFeedback('');
    setDetectedGesture('');
    
    if (currentIndex < ASL_VOCABULARY.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      stopCamera();
      alert(`Quiz Complete! Your score: ${score}/${ASL_VOCABULARY.length}`);
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
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentIndex === 0
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

  const renderQuiz = () => {
    const currentWord = ASL_VOCABULARY[currentIndex];
    return (
      <div className="py-6">
        <div className="text-center mb-6">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Question {currentIndex + 1} of {ASL_VOCABULARY.length} | Score: {score}
          </span>
        </div>
        
        <div className={`p-8 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-50 to-pink-50'} mb-6 text-center`}>
          <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            Show the sign for:
          </h3>
          <p className="text-4xl font-bold text-purple-600 mb-4">{currentWord.word}</p>
          
          {!showVideo ? (
            <button
              onClick={startCamera}
              disabled={!gestureRecognizer || isStartingCamera}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isStartingCamera ? '⏳ Starting Camera...' : gestureRecognizer ? '📹 Start Camera to Show Sign' : '⏳ Loading...'}
            </button>
          ) : (
            <div>
              <video
                ref={videoRef}
                className="w-full max-w-md mx-auto rounded-lg mb-4 mirror-video"
                autoPlay
                playsInline
                muted
              />
              {detectedGesture && (
                <p className={`text-lg mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  Detected: <strong>{detectedGesture}</strong>
                </p>
              )}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleQuizSubmit}
                  disabled={isChecking || !detectedGesture}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  {isChecking ? 'Checking...' : '✓ Check Answer'}
                </button>
              </div>
              <p className={`text-xs mt-3 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Camera will stay on for all questions. Show gesture and click Check Answer.
              </p>
            </div>
          )}
        </div>

        {feedback && (
          <div className={`p-4 rounded-lg mb-4 ${
            feedback.includes('✅') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {feedback}
          </div>
        )}

        {feedback && (
          <button
            onClick={handleQuizNext}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            {currentIndex < ASL_VOCABULARY.length - 1 ? 'Next Question →' : 'Finish Quiz'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
      }`}>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Learning Mode</h2>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="text-white/80 hover:text-white transition-colors"
          >
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
              onClick={() => { stopCamera(); setMode('menu'); setCurrentIndex(0); setFeedback(''); }}
              className={`w-full mt-4 px-6 py-3 rounded-lg font-medium transition-colors ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
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
