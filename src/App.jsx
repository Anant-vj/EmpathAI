// src/components/GestureCamera.jsx
import React, { useRef, useEffect } from "react";
import { detectGesture } from "../gestureUtils";
import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";

export default function GestureCamera({ onGestureDetected }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await video.play();

      async function predict() {
        const results = await recognizer.recognizeForVideo(video, Date.now());
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];
          const gesture = detectGesture(landmarks);
          if (gesture && onGestureDetected) onGestureDetected(gesture);

          // draw landmarks
          ctx.fillStyle = "lime";
          for (const p of landmarks) {
            ctx.beginPath();
            ctx.arc(p.x * canvas.width, p.y * canvas.height, 5, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
        requestAnimationFrame(predict);
      }

      predict();
    }

    init();
  }, [onGestureDetected]);

  return (
    <div style={{ position: "relative" }}>
      <video
        ref={videoRef}
        width="480"
        height="360"
        style={{ display: "none" }}
      />
      <canvas
        ref={canvasRef}
        width="480"
        height="360"
        style={{
          borderRadius: "12px",
          boxShadow: "0 0 8px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}
