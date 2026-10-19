// 100% Perfect 3D Folded Paper Ribbon & Solarized Camera Shader

export class CameraGlitchShader {
  constructor() {
    this.offCanvas = null;
    this.offCtx = null;
    this.style = 'RISOGRAPH_POP_ART';
    this.halftoneSize = 14;
    this.flapHeight = 36;
  }

  // Render 100% Perfect 3D Folded Paper Ribbon (Matching Photos 2 to 5)
  renderFoldedPaperRibbon(ctx, video, v0, v1, v2, v3, width, height) {
    if (!video || video.readyState < 2 || !v0 || !v1 || !v2 || !v3) return;

    ctx.save();

    const bannerH = (Math.hypot(v1.x - v0.x, v1.y - v0.y) + Math.hypot(v3.x - v2.x, v3.y - v2.y)) / 2;

    if (bannerH < 8) {
      ctx.restore();
      return;
    }

    // 1. Clip Main Canvas to Quadrilateral Banner (V0: Left Top, V2: Right Top, V3: Right Bottom, V1: Left Bottom)
    ctx.beginPath();
    ctx.moveTo(v0.x, v0.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);
    ctx.lineTo(v1.x, v1.y);
    ctx.closePath();
    ctx.clip();

    // Solid base background to guarantee zero video bleed-through
    ctx.fillStyle = '#061d38';
    ctx.fillRect(0, 0, width, height);

    // 2. Offscreen Canvas Processing for Full Solarized Live Camera Video
    if (!this.offCanvas) {
      this.offCanvas = document.createElement('canvas');
      this.offCtx = this.offCanvas.getContext('2d');
    }

    if (this.offCanvas.width !== width || this.offCanvas.height !== height) {
      this.offCanvas.width = width;
      this.offCanvas.height = height;
    }

    // Draw live webcam video to cover full resolution canvas
    this.offCtx.drawImage(video, 0, 0, width, height);
    const imgData = this.offCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Apply Selected Preset Color Palette
    this.applyColorPreset(data);

    this.offCtx.putImageData(imgData, 0, 0);

    // Draw Solarized Live Camera Video across the entire canvas
    ctx.globalAlpha = 1.0;
    ctx.drawImage(this.offCanvas, 0, 0, width, height, 0, 0, width, height);

    // 3. Render 3D Paper Fold Panels (Top White Halftone Flap, Bottom Navy Flap)
    this.render3DPaperPanels(ctx, v0, v1, v2, v3, bannerH);

    ctx.restore();
  }

  // Apply Selected Preset Color Palette (Risograph, Cyanotype, Thermal)
  applyColorPreset(data) {
    const style = this.style || 'RISOGRAPH_POP_ART';

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      if (style === 'CYANOTYPE_BLUEPRINT') {
        // Cyanotype Blueprint
        if (lum < 0.3) {
          data[i] = 4; data[i + 1] = 16; data[i + 2] = 33; // Deep Indigo (#041021)
        } else if (lum < 0.65) {
          data[i] = 0; data[i + 1] = 119; data[i + 2] = 182; // Blueprint Cyan (#0077b6)
        } else {
          data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; // White
        }
      } else if (style === 'THERMAL_SPECTRUM') {
        // Thermal Solarized
        if (lum < 0.25) {
          data[i] = 114; data[i + 1] = 9; data[i + 2] = 183; // Purple (#7209b7)
        } else if (lum < 0.5) {
          data[i] = 76; data[i + 1] = 201; data[i + 2] = 240; // Cyan (#4cc9f0)
        } else if (lum < 0.75) {
          data[i] = 254; data[i + 1] = 228; data[i + 2] = 64; // Yellow (#fee440)
        } else {
          data[i] = 247; data[i + 1] = 37; data[i + 2] = 133; // Hot Pink (#f72585)
        }
      } else {
        // Risograph Pop-Art Default (Navy Blue, Emerald Green, Yellow, Off-White)
        if (lum < 0.28) {
          data[i] = 6; data[i + 1] = 29; data[i + 2] = 56;
        } else if (lum < 0.52) {
          data[i] = 0; data[i + 1] = 200; data[i + 2] = 83;
        } else if (lum < 0.76) {
          data[i] = 255; data[i + 1] = 214; data[i + 2] = 0;
        } else {
          data[i] = 255; data[i + 1] = 253; data[i + 2] = 247;
        }
      }

      // Enforce 100% full opacity (Zero Transparency)
      data[i + 3] = 255;
    }
  }

  // Render 3D Paper Fold Flaps (Top White Halftone Flap, Bottom Navy Flap)
  render3DPaperPanels(ctx, v0, v1, v2, v3, bannerH) {
    const flapH = Math.min(42, bannerH * 0.24);

    // --- TOP FLAP (Off-White Paper Strip + Red Halftone Dots) ---
    const t0 = { x: v0.x, y: v0.y };
    const t2 = { x: v2.x, y: v2.y };
    const t1 = { x: v0.x + (v1.x - v0.x) * (flapH / bannerH), y: v0.y + (v1.y - v0.y) * (flapH / bannerH) };
    const t3 = { x: v2.x + (v3.x - v2.x) * (flapH / bannerH), y: v2.y + (v3.y - v2.y) * (flapH / bannerH) };

    ctx.fillStyle = '#fffdf7';
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.moveTo(t0.x, t0.y);
    ctx.lineTo(t2.x, t2.y);
    ctx.lineTo(t3.x, t3.y);
    ctx.lineTo(t1.x, t1.y);
    ctx.closePath();
    ctx.fill();

    // Red Halftone Dots on Top Flap Corners
    this.renderRedHalftoneDots(ctx, t0, t1, t2, t3);

    // Top Crease Vector Line
    ctx.strokeStyle = '#061d38';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(t1.x, t1.y);
    ctx.lineTo(t3.x, t3.y);
    ctx.stroke();

    // --- BOTTOM FLAP (Prussian Navy Blue Strip #061d38) ---
    const b1 = { x: v1.x, y: v1.y };
    const b3 = { x: v3.x, y: v3.y };
    const b0 = { x: v1.x - (v1.x - v0.x) * (flapH / bannerH), y: v1.y - (v1.y - v0.y) * (flapH / bannerH) };
    const b2 = { x: v3.x - (v3.x - v2.x) * (flapH / bannerH), y: v3.y - (v3.y - v2.y) * (flapH / bannerH) };

    ctx.fillStyle = '#061d38';
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.moveTo(b0.x, b0.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.lineTo(b3.x, b3.y);
    ctx.lineTo(b1.x, b1.y);
    ctx.closePath();
    ctx.fill();

    // Bottom Crease Vector Line
    ctx.strokeStyle = '#fffdf7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(b0.x, b0.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.stroke();
  }

  // Render Red Comic Halftone Dots (#e60026) on Top Paper Flap Corners
  renderRedHalftoneDots(ctx, p0, p1, p2, p3) {
    ctx.save();
    ctx.fillStyle = '#e60026';
    ctx.globalAlpha = 1.0;

    const step = Math.max(8, this.halftoneSize);
    const w = Math.hypot(p2.x - p0.x, p2.y - p0.y);
    const num = Math.floor(w / step);

    for (let i = 0; i <= num; i++) {
      if (i < 5 || i > num - 5) {
        const t = i / Math.max(1, num);
        const x = p0.x + (p2.x - p0.x) * t;
        const y = p0.y + (p2.y - p0.y) * t;

        const r = 2.8 + (i % 3) * 1.5;
        ctx.beginPath();
        ctx.arc(x, y + 6, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}
