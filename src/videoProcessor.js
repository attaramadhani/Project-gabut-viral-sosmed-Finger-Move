// Video File Import & Frame-by-Frame Rotoscope Processor

export class VideoProcessor {
  constructor(videoElement, canvasElement, rotoscopeEngine) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.engine = rotoscopeEngine;

    this.pose = null;
    this.isPlaying = false;
    this.currentPoseLandmarks = null;
    this.animFrameId = null;

    this.setupPoseModel();
  }

  // Setup MediaPipe Pose AI model
  setupPoseModel() {
    if (typeof window.Pose === 'undefined') {
      setTimeout(() => this.setupPoseModel(), 500);
      return;
    }

    this.pose = new window.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    this.pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.pose.onResults((results) => {
      this.currentPoseLandmarks = results.poseLandmarks || null;
    });
  }

  // Load user video file (MP4, WebM, MOV)
  loadVideoFile(file) {
    const url = URL.createObjectURL(file);
    this.video.src = url;
    this.video.load();
    this.video.play().then(() => {
      this.isPlaying = true;
      this.startRenderLoop();
    }).catch(err => {
      console.warn('Auto-play blocked or waiting for click', err);
    });
  }

  play() {
    this.video.play();
    this.isPlaying = true;
    this.startRenderLoop();
  }

  pause() {
    this.video.pause();
    this.isPlaying = false;
  }

  togglePlay() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  setPlaybackSpeed(speed) {
    this.video.playbackRate = speed;
  }

  seekToRatio(ratio) {
    if (this.video.duration) {
      this.video.currentTime = ratio * this.video.duration;
    }
  }

  // Main Frame Processing & Render Loop
  startRenderLoop() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

    const loop = async () => {
      if (this.video.readyState >= 2) {
        // Match canvas dimensions to video
        if (this.canvas.width !== this.video.videoWidth || this.canvas.height !== this.video.videoHeight) {
          this.canvas.width = this.video.videoWidth || 1280;
          this.canvas.height = this.video.videoHeight || 720;
        }

        // 1. Send video frame to MediaPipe Pose model
        if (this.pose) {
          try {
            await this.pose.send({ image: this.video });
          } catch (e) {
            // Processing frame
          }
        }

        // 2. Clear & Draw video frame backdrop
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        // 3. Render Rotoscope Vector Tracing Overlay
        this.engine.render(this.ctx, this.canvas.width, this.canvas.height, this.currentPoseLandmarks);
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    loop();
  }
}
