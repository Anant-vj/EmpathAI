import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

function CustomGestureTrainer({ gestureRecognizer, onClose }) {
  const [gestureName, setGestureName] = useState('');
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [customGestures, setCustomGestures] = useState([]);
  const videoRef = useRef(null);
  const recordingDataRef = useRef([]);
  const recordingIntervalRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('customGestures');
    if (saved) {
      setCustomGestures(JSON.parse(saved));
    }
  }, []);

  const startRecording = async () => {
    if (!gestureName.trim()) {
      alert('Please enter a gesture name first');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      
      recordingDataRef.current = [];
      setIsRecording(true);

      recordingIntervalRef.current = setInterval(() => {
        if (gestureRecognizer && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          const nowInMs = Date.now();
          const results = gestureRecognizer.recognizeForVideo(videoRef.current, nowInMs);
          
          if (results.landmarks && results.landmarks[0]) {
            const landmarkData = results.landmarks[0].map(lm => [lm.x, lm.y, lm.z]).flat();
            recordingDataRef.current.push(landmarkData);
          }
        }
      }, 100);

      setTimeout(() => {
        stopRecording();
      }, 3000);
    } catch (error) {
      console.error('Recording error:', error);
      alert('Failed to access camera');
    }
  };

  const stopRecording = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }

    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }

    setIsRecording(false);

    if (recordingDataRef.current.length > 0) {
      const avgLandmarks = calculateAverageLandmarks(recordingDataRef.current);
      const newRecording = {
        name: gestureName,
        data: avgLandmarks,
        timestamp: Date.now(),
        samples: recordingDataRef.current.length
      };

      const updated = [...customGestures, newRecording];
      setCustomGestures(updated);
      localStorage.setItem('customGestures', JSON.stringify(updated));
      setRecordings([...recordings, newRecording]);
      setGestureName('');
      
      alert(`Gesture "${gestureName}" recorded successfully! (${recordingDataRef.current.length} samples)`);
    }
  };

  const calculateAverageLandmarks = (samples) => {
    const numFeatures = samples[0].length;
    const avg = new Array(numFeatures).fill(0);
    
    samples.forEach(sample => {
      sample.forEach((val, idx) => {
        avg[idx] += val;
      });
    });

    return avg.map(val => val / samples.length);
  };

  const deleteGesture = (index) => {
    const updated = customGestures.filter((_, i) => i !== index);
    setCustomGestures(updated);
    localStorage.setItem('customGestures', JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <h2 className="text-2xl font-bold">🎓 Custom Gesture Trainer</h2>
          <p className="text-purple-100">Record and train your own sign language gestures</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>📹 How to train:</strong> Enter a gesture name, click "Record Gesture",
              then perform the gesture for 3 seconds. The system will capture hand landmarks
              and save them for recognition.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gesture Name
              </label>
              <input
                type="text"
                value={gestureName}
                onChange={(e) => setGestureName(e.target.value)}
                placeholder="e.g., Hello, Thank You, Help..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                disabled={isRecording}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={startRecording}
                disabled={isRecording || !gestureName.trim()}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isRecording ? '🔴 Recording (3s)...' : '🎥 Record Gesture'}
              </button>
            </div>

            <div className="relative">
              <video
                ref={videoRef}
                className={`w-full rounded-lg shadow-lg ${!isRecording && 'hidden'}`}
                playsInline
              />
              {!isRecording && (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">🎬</div>
                    <p>Camera will activate during recording</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Trained Gestures ({customGestures.length})</h3>
            {customGestures.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                <p>No custom gestures yet. Record your first gesture above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customGestures.map((gesture, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{gesture.name}</h4>
                      <p className="text-sm text-gray-500">
                        {gesture.samples} samples • {new Date(gesture.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteGesture(idx)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Close Trainer
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomGestureTrainer;
