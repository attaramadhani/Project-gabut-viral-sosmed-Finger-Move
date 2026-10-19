// Hand Gesture Classifier for Spider-Gwen Visual FX

export const GESTURE_TYPES = {
  NONE: 'NONE',
  WEB_SHOOTER: 'WEB_SHOOTER', // 🤟 Index + Pinky extended, Middle + Ring folded
  PINCH: 'PINCH',            // 🤏 Index tip & Thumb tip pinch
  SPIDER_SENSE: 'SPIDER_SENSE', // ✋ All fingers extended
  GLITCH_FIST: 'GLITCH_FIST', // ✊ All fingers folded into fist
  VICTORY: 'VICTORY'         // ✌️ Index + Middle extended
};

export class GestureClassifier {
  constructor() {
    this.lastGesture = GESTURE_TYPES.NONE;
    this.gestureHoldFrames = 0;
  }

  // Calculate 2D/3D Euclidean distance between two landmarks
  dist(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = (p1.z || 0) - (p2.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // Detect finger extension status (true = extended, false = folded)
  isFingerExtended(landmarks, tipIdx, pipIdx, mcpIdx, wrist = landmarks[0]) {
    const tip = landmarks[tipIdx];
    const pip = landmarks[pipIdx];
    const mcp = landmarks[mcpIdx];

    // Distance from wrist to tip vs wrist to pip
    const dTip = this.dist(wrist, tip);
    const dPip = this.dist(wrist, pip);
    
    return dTip > dPip * 1.1 && tip.y < mcp.y + 0.05;
  }

  classify(landmarks) {
    if (!landmarks || landmarks.length < 21) {
      return GESTURE_TYPES.NONE;
    }

    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const indexPip = landmarks[6];
    const indexMcp = landmarks[5];

    const middleTip = landmarks[12];
    const middlePip = landmarks[10];
    const middleMcp = landmarks[9];

    const ringTip = landmarks[16];
    const ringPip = landmarks[14];
    const ringMcp = landmarks[13];

    const pinkyTip = landmarks[20];
    const pinkyPip = landmarks[18];
    const pinkyMcp = landmarks[17];

    // Check finger states
    const isIndexUp = this.dist(wrist, indexTip) > this.dist(wrist, indexPip);
    const isMiddleUp = this.dist(wrist, middleTip) > this.dist(wrist, middlePip);
    const isRingUp = this.dist(wrist, ringTip) > this.dist(wrist, ringPip);
    const isPinkyUp = this.dist(wrist, pinkyTip) > this.dist(wrist, pinkyPip);

    // 1. PINCH Gesture (Index tip & Thumb tip very close)
    const pinchDist = this.dist(indexTip, thumbTip);
    if (pinchDist < 0.065) {
      return GESTURE_TYPES.PINCH;
    }

    // 2. WEB SHOOTER Gesture (🤟 Index & Pinky UP, Middle & Ring DOWN)
    if (isIndexUp && isPinkyUp && !isMiddleUp && !isRingUp) {
      return GESTURE_TYPES.WEB_SHOOTER;
    }

    // 3. SPIDER SENSE (✋ Open Palm - All fingers extended)
    if (isIndexUp && isMiddleUp && isRingUp && isPinkyUp) {
      return GESTURE_TYPES.SPIDER_SENSE;
    }

    // 4. GLITCH FIST (✊ Fist - All fingers folded)
    if (!isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
      return GESTURE_TYPES.GLITCH_FIST;
    }

    // 5. VICTORY (✌️ Index + Middle UP, Ring + Pinky DOWN)
    if (isIndexUp && isMiddleUp && !isRingUp && !isPinkyUp) {
      return GESTURE_TYPES.VICTORY;
    }

    return GESTURE_TYPES.NONE;
  }
}
