// MediaRecorder and Canvas Snapshot Utility

export class CanvasRecorder {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
  }

  startRecording() {
    this.recordedChunks = [];
    const stream = this.canvas.captureStream(30); // 30 FPS stream

    const options = { mimeType: 'video/webm;codecs=vp9' };
    try {
      this.mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
      try {
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      } catch (err) {
        this.mediaRecorder = new MediaRecorder(stream);
      }
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `spider_gwen_effect_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    };

    this.mediaRecorder.start();
    this.isRecording = true;
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  takeSnapshot() {
    const dataUrl = this.canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `spider_gwen_snapshot_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
