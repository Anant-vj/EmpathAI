import React, { useRef, useState, useEffect } from 'react';
import { GestureRecognizer, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import { detectSentiment } from './SentimentDetector';
import { useTheme } from './ThemeContext';

function MobileTranslator({ onWellnessPrompt }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState('');
  const [error, setError] = useState('');
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [lastSpokenGesture, setLastSpokenGesture] = useState('');
  const animationFrameRef = useRef(null);
  
  const [autoResponseMode, setAutoResponseMode] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [customGestures, setCustomGestures] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showWellnessPrompt, setShowWellnessPrompt] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState('');
  
  const { isDark } = useTheme();

  useEffect(() => {
    const initializeGestureRecognizer = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        let recognizer;
        try {
          recognizer = await GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
              delegate: 'GPU'
            },
            runningMode: 'VIDEO',
            numHands: 2
          });
        } catch (gpuError) {
          console.warn('GPU initialization failed, falling back to CPU:', gpuError);
          recognizer = await GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
              delegate: 'CPU'
            },
            runningMode: 'VIDEO',
            numHands: 2
          });
        }

        setGestureRecognizer(recognizer);
        setError('');
      } catch (err) {
        console.error('Failed to initialize gesture recognizer:', err);
        setError('Unable to load gesture recognition. This device may not support the required features.');
      }
    };

    initializeGestureRecognizer();

    const saved = localStorage.getItem('userProfile');
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }

    const savedGestures = localStorage.getItem('customGestures');
    if (savedGestures) {
      setCustomGestures(JSON.parse(savedGestures));
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAutoResponse = async (gesture) => {
    if (!autoResponseMode || !userProfile) return;

    const responses = {
      'hello': userProfile.greeting || `Hello! My name is ${userProfile.name || 'there'}. Nice to meet you!`,
      'introduce': userProfile.introduction || `My name is ${userProfile.name}. ${userProfile.about || 'Pleased to meet you!'}`,
      'greeting': userProfile.greeting || 'Hello! How are you?',
      'thanks': 'You\'re welcome! Happy to help.',
      'help': 'I\'m here to assist. What do you need?'
    };

    const gestureLower = gesture.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
      if (gestureLower.includes(key)) {
        speak(response);
        setConversationHistory(prev => [...prev, { gesture, response, timestamp: Date.now() }]);
        break;
      }
    }
  };

  const checkSentiment = (text) => {
    const result = detectSentiment(text);
    if (result.isNegative) {
      setDetectedEmotion(text);
      setShowWellnessPrompt(true);
    }
  };

  const matchCustomGesture = (landmarks) => {
    if (!landmarks || customGestures.length === 0) return null;

    const currentData = landmarks.map(lm => [lm.x, lm.y, lm.z]).flat();
    let bestMatch = null;
    let bestDistance = Infinity;

    customGestures.forEach(gesture => {
      const distance = calculateEuclideanDistance(currentData, gesture.data);
      if (distance < bestDistance && distance < 0.15) {
        bestDistance = distance;
        bestMatch = gesture.name;
      }
    });

    return bestMatch;
  };

  const calculateEuclideanDistance = (a, b) => {
    if (a.length !== b.length) return Infinity;
    const sum = a.reduce((acc, val, idx) => acc + Math.pow(val - b[idx], 2), 0);
    return Math.sqrt(sum);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsActive(true);
          setError('');
          detectGestures();
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please grant camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setDetectedGesture('');
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const detectGestures = () => {
    if (!gestureRecognizer || !videoRef.current || !isActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const nowInMs = Date.now();
      const results = gestureRecognizer.recognizeForVideo(video, nowInMs);

      if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.landmarks) {
          const drawingUtils = new DrawingUtils(ctx);
          for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(
              landmarks,
              GestureRecognizer.HAND_CONNECTIONS,
              { color: '#00FF00', lineWidth: 5 }
            );
            drawingUtils.drawLandmarks(landmarks, {
              color: '#FF0000',
              lineWidth: 2
            });
          }
        }
      }

      let detectedName = '';
      let confidence = 0;

      if (results.landmarks && results.landmarks[0]) {
        const customMatch = matchCustomGesture(results.landmarks[0]);
        if (customMatch) {
          detectedName = customMatch;
          confidence = 85;
        }
      }

      if (!detectedName && results.gestures && results.gestures.length > 0) {
        const gesture = results.gestures[0][0];
        detectedName = gesture.categoryName;
        confidence = (gesture.score * 100).toFixed(0);
      }

      if (detectedName) {
        const displayText = `${detectedName} (${confidence}%)`;
        setDetectedGesture(displayText);

        if (detectedName !== lastSpokenGesture && confidence > 70) {
          speak(detectedName);
          setLastSpokenGesture(detectedName);
          
          checkSentiment(detectedName);
          handleAutoResponse(detectedName);
          
          setTimeout(() => {
            setLastSpokenGesture('');
          }, 2000);
        }
      } else {
        setDetectedGesture('No gesture detected');
      }
    }

    animationFrameRef.current = requestAnimationFrame(detectGestures);
  };

  useEffect(() => {
    if (isActive && gestureRecognizer) {
      detectGestures();
    }
  }, [isActive, gestureRecognizer]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className={`rounded-2xl shadow-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>EmpathAI</h1>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sign Language Translator</p>
                </div>
              </div>
            </div>

            <div className="relative w-full aspect-video mb-4">
              <video
                ref={videoRef}
                className={`w-full h-full rounded-lg object-cover ${!isActive && 'hidden'}`}
                playsInline
              />
              <canvas
                ref={canvasRef}
                className={`absolute top-0 left-0 w-full h-full ${!isActive && 'hidden'}`}
              />
              
              {!isActive && !error && (
                <div className={`w-full h-full rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div className="text-center">
                    <div className="text-6xl mb-4">🤟</div>
                    <p className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Ready to translate signs
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Tap Start Camera to begin
                    </p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {detectedGesture && isActive && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg text-center">
                <p className="text-lg font-semibold">
                  <span className="text-2xl">{detectedGesture}</span>
                </p>
              </div>
            )}

            <div className="flex justify-center mb-4">
              {!isActive ? (
                <button
                  onClick={startCamera}
                  disabled={!gestureRecognizer}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg text-lg"
                >
                  {gestureRecognizer ? '🎥 Start Camera' : 'Loading...'}
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="w-full bg-red-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg text-lg"
                >
                  🛑 Stop Camera
                </button>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
              <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                🤖 Auto-Response Mode
              </span>
              <button
                onClick={() => setAutoResponseMode(!autoResponseMode)}
                disabled={!userProfile}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoResponseMode ? 'bg-indigo-600' : 'bg-gray-300'
                } ${!userProfile && 'opacity-50 cursor-not-allowed'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoResponseMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {showWellnessPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl shadow-2xl p-6 max-w-md w-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  MindMate is Here for You
                </h3>
                <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  I noticed you said: "<strong>{detectedEmotion}</strong>"
                </p>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Would you like emotional support from MindMate?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowWellnessPrompt(false);
                    onWellnessPrompt(detectedEmotion);
                  }}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Yes, let's talk
                </button>
                <button
                  onClick={() => setShowWellnessPrompt(false)}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileTranslator;
