import React, { useRef, useState, useEffect } from 'react';
import { GestureRecognizer, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

function Translator() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState('');
  const [error, setError] = useState('');
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [lastSpokenGesture, setLastSpokenGesture] = useState('');
  const animationFrameRef = useRef(null);

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

      if (results.gestures && results.gestures.length > 0) {
        const gesture = results.gestures[0][0];
        const gestureName = gesture.categoryName;
        const confidence = (gesture.score * 100).toFixed(0);
        
        const displayText = `${gestureName} (${confidence}%)`;
        setDetectedGesture(displayText);

        if (gestureName !== lastSpokenGesture && gesture.score > 0.7) {
          speak(gestureName);
          setLastSpokenGesture(gestureName);
          
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
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full bg-indigo-50 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-indigo-900 mb-2">
          Sign Language Translator
        </h2>
        <p className="text-gray-600">
          Detects hand gestures using MediaPipe and speaks them aloud
        </p>
      </div>

      <div className="relative w-full max-w-2xl">
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
              <p className="text-gray-600">Click "Start Camera" to begin</p>
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

      <div className="flex gap-4">
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

      <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 How it works:</strong> MediaPipe detects common hand gestures
          like "Thumbs Up", "Victory", "Open Palm", and more. Detected gestures
          will be spoken aloud using your browser's speech synthesis.
        </p>
      </div>
    </div>
  );
}

export default Translator;
