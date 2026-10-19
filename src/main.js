// Risograph 3D Studio — TouchDesigner Engine Main Entry
import { PortalEngine } from './portalEngine.js';
import { HandSimulator } from './simulator.js';
import { CanvasRecorder } from './recorder.js';

// DOM Elements
const videoElement = document.getElementById('webcam-video');
const canvasElement = document.getElementById('portal-canvas');
const ctx = canvasElement.getContext('2d');

const btnModeToggle = document.getElementById('btn-mode-toggle');
const btnTechHUD = document.getElementById('btn-tech-hud');
const btnSnapshot = document.getElementById('btn-snapshot');
const btnRecordVideo = document.getElementById('btn-record-video');

const txtStatus = document.getElementById('txt-status');
const valFps = document.getElementById('val-fps');
const valHands = document.getElementById('val-hands');

const sliderDots = document.getElementById('slider-dots');
const sliderSmooth = document.getElementById('slider-smooth');
const sliderFlap = document.getElementById('slider-flap');

const valDots = document.getElementById('val-dots');
const valSmooth = document.getElementById('val-smooth');
const valFlap = document.getElementById('val-flap');

const presetCards = document.querySelectorAll('.preset-card');

// Core Engines
const portal = new PortalEngine();
const simulator = new HandSimulator(canvasElement);
const recorder = new CanvasRecorder(canvasElement);

let camera = null;
let hands = null;
let activeMode = 'WEBCAM'; // 'WEBCAM' or 'SIMULATOR'
let isRecording = false;

let frameCount = 0;
let lastFpsUpdate = Date.now();

// Setup MediaPipe Hands Tracking for Dual Hands
function initMediaPipe() {
  if (typeof window.Hands === 'undefined') {
    setTimeout(initMediaPipe, 500);
    return;
  }

  hands = new window.Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
  });

  hands.onResults(onHandResults);

  if (typeof window.Camera !== 'undefined') {
    camera = new window.Camera(videoElement, {
      onFrame: async () => {
        if (activeMode === 'WEBCAM' && videoElement.readyState >= 2) {
          await hands.send({ image: videoElement });
        }
      },
      width: 1280,
      height: 720
    });
    camera.start().then(() => {
      txtStatus.textContent = 'WEBCAM ACTIVE';
    }).catch(err => {
      console.warn('Webcam unavailable. Switching to Hand Simulator mode.', err);
      txtStatus.textContent = 'SIMULATOR ACTIVE';
      switchMode('SIMULATOR');
    });
  }
}

// MediaPipe Callback on Hand Tracking Detection
function onHandResults(results) {
  if (activeMode !== 'WEBCAM') return;

  // Update FPS
  frameCount++;
  const now = Date.now();
  if (now - lastFpsUpdate >= 1000) {
    valFps.textContent = frameCount;
    frameCount = 0;
    lastFpsUpdate = now;
  }

  ctx.save();
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // 1. Draw Clean Live Webcam Feed as Background
  if (results.image) {
    ctx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  }

  const multiHandLandmarks = results.multiHandLandmarks || [];
  valHands.textContent = `${multiHandLandmarks.length} / 2 REQUIRED`;

  // 2. Render 3D Origami Paper Ribbon Solarized Engine
  portal.render(ctx, videoElement, canvasElement.width, canvasElement.height, multiHandLandmarks);

  ctx.restore();
}

// Simulator Animation Loop
function simulatorRenderLoop() {
  if (activeMode === 'SIMULATOR') {
    ctx.save();
    canvasElement.width = 1280;
    canvasElement.height = 720;

    // Draw dark obsidian background
    ctx.fillStyle = '#070a11';
    ctx.fillRect(0, 0, 1280, 720);

    // Draw background grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1280; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, 720);
      ctx.stroke();
    }
    for (let y = 0; y < 720; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(1280, y);
      ctx.stroke();
    }

    const dualHandLandmarks = simulator.getSimulatedDualHandLandmarks();
    valHands.textContent = `2 / 2 (SIMULATOR)`;

    portal.render(ctx, canvasElement, canvasElement.width, canvasElement.height, dualHandLandmarks);

    // Draw Hand Cursor Hints
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('🖱️ Drag Mouse to move Hand | Click / Tab to switch Left/Right Hand', 24, 36);

    ctx.restore();
  }
  requestAnimationFrame(simulatorRenderLoop);
}

// Mode Switcher
function switchMode(mode) {
  activeMode = mode;
  if (mode === 'WEBCAM') {
    simulator.setEnabled(false);
    txtStatus.textContent = 'WEBCAM ACTIVE';
  } else {
    simulator.setEnabled(true);
    txtStatus.textContent = 'SIMULATOR ACTIVE';
  }
}

// Preset Cards Switcher
presetCards.forEach(card => {
  card.addEventListener('click', () => {
    presetCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    const preset = card.dataset.preset;
    portal.shader.style = preset;
  });
});

// UI Event Listeners
btnModeToggle.addEventListener('click', () => {
  switchMode(activeMode === 'WEBCAM' ? 'SIMULATOR' : 'WEBCAM');
});

btnTechHUD.addEventListener('click', () => {
  portal.showTechHUD = !portal.showTechHUD;
  btnTechHUD.classList.toggle('btn-secondary', portal.showTechHUD);
});

// Sliders Listeners
sliderDots.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  portal.shader.halftoneSize = val;
  valDots.textContent = `${val} px`;
});

sliderSmooth.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  portal.smoothFactor = val / 100;
  valSmooth.textContent = `${val}%`;
});

sliderFlap.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  valFlap.textContent = `${val} px`;
});

// Exporters
btnSnapshot.addEventListener('click', () => {
  recorder.takeSnapshot();
});

btnRecordVideo.addEventListener('click', () => {
  if (isRecording) {
    recorder.stopRecording();
    btnRecordVideo.classList.remove('btn-recording');
    btnRecordVideo.innerHTML = '<span>🔴</span> Start Record';
    isRecording = false;
  } else {
    recorder.startRecording();
    btnRecordVideo.classList.add('btn-recording');
    btnRecordVideo.innerHTML = '<span>⏹️</span> Stop Record';
    isRecording = true;
  }
});

// Initialize
initMediaPipe();
requestAnimationFrame(simulatorRenderLoop);
