export function detectGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return "UNKNOWN";

  const isFingerUp = (tip, pip) => landmarks[tip].y < landmarks[pip].y;
  const thumbUp = landmarks[4].y < landmarks[3].y && Math.abs(landmarks[4].x - landmarks[3].x) > 0.02;

  const indexUp = isFingerUp(8, 6);
  const middleUp = isFingerUp(12, 10);
  const ringUp = isFingerUp(16, 14);
  const pinkyUp = isFingerUp(20, 18);

  const allUp = indexUp && middleUp && ringUp && pinkyUp && thumbUp;
  const allDown = !indexUp && !middleUp && !ringUp && !pinkyUp && !thumbUp;

  if (allDown) return "FIST";
  if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) return "THUMBS_UP";
  if (!thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp && landmarks[4].y > landmarks[3].y)
    return "THUMBS_DOWN";
  if (indexUp && middleUp && !ringUp && !pinkyUp && !thumbUp) return "PEACE";
  if (allUp) return "WAVE";
  if (indexUp && !middleUp && !ringUp && !pinkyUp && !thumbUp) return "POINT";
  return "UNKNOWN";
}