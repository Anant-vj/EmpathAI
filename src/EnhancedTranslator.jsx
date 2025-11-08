import React, { useRef, useState, useEffect } from 'react';
import { GestureRecognizer, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import CustomGestureTrainer from './CustomGestureTrainer';
import ProfileSetup from './ProfileSetup';

function EnhancedTranslator() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState('');
  const [error, setError] = useState('');
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [lastSpokenGesture, setLastSpokenGesture] = useState('');
  const animationFrameRef = useRef(null);
  
  const [showTrainer, setShowTrainer] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [autoResponseMode, setAutoResponseMode] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [customGestures, setCustomGestures] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);

  useEffect(() => {
    const initializeGestureRecognizer = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        const recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 2
        });

        setGestureRecognizer(recognizer);
      } catch (err) {
        console.error('Failed to initialize gesture recognizer:', err);
        setError('Failed to load MediaPipe. Please refresh the page.');
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
        
        if (gestureLower.includes('introduce') || gestureLower.includes('greeting')) {
          await getAIResponse(gesture, response);
        }
        break;
      }
    }
  };

  const getAIResponse = async (gesture, spokenText) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `The user just performed a sign language gesture: "${gesture}". I said: "${spokenText}". Please provide a brief, warm follow-up response.`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTimeout(() => speak(data.response), 2000);
      }
    } catch (error) {
      console.error('AI response error:', error);
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
          width: 1280, 
          height: 720,
          facingMode: 'user'
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
    <div className="flex flex-col space-y-4">
      <div className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-indigo-900 mb-2">
          🤟 Enhanced Sign Language Translator
        </h2>
        <p className="text-gray-600 mb-4">
          AI-powered translation with custom training and auto-response mode
        </p>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-200">
            <input
              type="checkbox"
              id="autoResponse"
              checked={autoResponseMode}
              onChange={(e) => setAutoResponseMode(e.target.checked)}
              className="mr-2 h-4 w-4 text-indigo-600"
              disabled={!userProfile}
            />
            <label htmlFor="autoResponse" className="text-sm font-medium text-gray-700">
              🤖 Auto-Response Mode
            </label>
          </div>

          <button
            onClick={() => setShowProfile(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            {userProfile ? '✏️ Edit Profile' : '👤 Setup Profile'}
          </button>

          <button
            onClick={() => setShowTrainer(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            🎓 Train Custom Gestures ({customGestures.length})
          </button>
        </div>

        {autoResponseMode && userProfile && (
          <div className="mt-3 bg-green-100 border border-green-300 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>✅ Auto-Response Active:</strong> MindMate will automatically respond
              to greetings and introductions as {userProfile.name}
            </p>
          </div>
        )}

        {autoResponseMode && !userProfile && (
          <div className="mt-3 bg-yellow-100 border border-yellow-300 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Setup Required:</strong> Please configure your profile to enable auto-response mode
            </p>
          </div>
        )}
      </div>

      <div className="relative w-full max-w-2xl mx-auto">
        <video
          ref={videoRef}
          className={`w-full rounded-lg shadow-lg ${!isActive && 'hidden'}`}
          playsInline
        />
        <canvas
          ref={canvasRef}
          className={`absolute top-0 left-0 w-full h-full ${!isActive && 'hidden'}`}
        />
        
        {!isActive && !error && (
          <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🤟</div>
              <p className="text-gray-600 font-medium mb-2">Click "Start Camera" to begin</p>
              <p className="text-sm text-gray-500">
                {customGestures.length > 0 && `${customGestures.length} custom gesture(s) trained`}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {detectedGesture && isActive && (
        <div className="w-full bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg text-center">
          <p className="text-lg font-semibold">
            Detected: <span className="text-2xl">{detectedGesture}</span>
          </p>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        {!isActive ? (
          <button
            onClick={startCamera}
            disabled={!gestureRecognizer}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {gestureRecognizer ? '🎥 Start Camera' : 'Loading MediaPipe...'}
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            🛑 Stop Camera
          </button>
        )}
      </div>

      {conversationHistory.length > 0 && (
        <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💬 Recent Auto-Responses</h3>
          <div className="space-y-2">
            {conversationHistory.slice(-3).reverse().map((item, idx) => (
              <div key={idx} className="text-sm text-blue-800">
                <strong>{item.gesture}</strong> → {item.response}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Features:</strong> This translator uses MediaPipe for pretrained gestures
          (Thumbs Up, Victory, Open Palm, etc.) + your custom trained gestures. Auto-response
          mode lets MindMate AI handle conversations on your behalf!
        </p>
      </div>

      {showTrainer && (
        <CustomGestureTrainer
          gestureRecognizer={gestureRecognizer}
          onClose={() => {
            setShowTrainer(false);
            const saved = localStorage.getItem('customGestures');
            if (saved) setCustomGestures(JSON.parse(saved));
          }}
        />
      )}

      {showProfile && (
        <ProfileSetup
          onClose={() => setShowProfile(false)}
          onSave={(profile) => setUserProfile(profile)}
        />
      )}
    </div>
  );
}

export default EnhancedTranslator;
