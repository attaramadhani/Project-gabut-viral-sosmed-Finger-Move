// Spider-Gwen Rotoscope & Vector Tracing Animation Engine

export const ROTOSCOPE_STYLES = {
  NEON_VECTOR: 'NEON_VECTOR',        // Glowing cyan/magenta vector lines
  SPIDER_GWEN_SUIT: 'SPIDER_GWEN',   // Iconic Gwen hood + suit vector paths
  COMIC_INK: 'COMIC_INK',            // Bold comic book ink outlines + halftone dots
  LINE_ANIMATION: 'LINE_ANIMATION'   // Animating stroke drawing paths
};

export class RotoscopeEngine {
  constructor() {
    this.style = ROTOSCOPE_STYLES.SPIDER_GWEN_SUIT;
    this.strokeWidth = 3.5;
    this.glowIntensity = 20;
    this.smoothing = 0.5;
    this.bgOpacity = 0.85; // Opacity of original video background (0 = dark canvas, 1 = full video)
    this.animTime = 0;
    this.primaryColor = '#00f3ff';
    this.secondaryColor = '#ff007f';
  }

  setStyle(style) {
    this.style = style;
  }

  // Smooth array of 2D points using Catmull-Rom spline interpolation
  getInterpolatedCurve(points, numSegments = 12) {
    if (points.length < 2) return points;
    const curvePoints = [];
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      for (let t = 0; t <= 1; t += 1 / numSegments) {
        const t2 = t * t;
        const t3 = t2 * t;

        const x = 0.5 * ((2 * p1.x) +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

        const y = 0.5 * ((2 * p1.y) +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.x) * t3);

        curvePoints.push({ x, y });
      }
    }
    return curvePoints;
  }

  // Render Rotoscope Vector Line Art onto Canvas
  render(ctx, width, height, poseLandmarks = null) {
    this.animTime += 0.05;

    ctx.save();

    // Dark background wash if bgOpacity < 1.0
    if (this.bgOpacity < 1.0) {
      ctx.fillStyle = `rgba(9, 7, 20, ${1 - this.bgOpacity})`;
      ctx.fillRect(0, 0, width, height);
    }

    if (!poseLandmarks || poseLandmarks.length < 33) {
      ctx.restore();
      return;
    }

    // Map 0-1 normalized pose landmarks to canvas pixels
    const pts = poseLandmarks.map(p => ({
      x: p.x * width,
      y: p.y * height,
      visibility: p.visibility || 1.0
    }));

    // Key Pose Points:
    // Nose: 0, Eyes: 2, 5, Ears: 7, 8, Shoulders: 11, 12, Elbows: 13, 14, Wrists: 15, 16, Hips: 23, 24
    const headCenter = { x: (pts[0].x + pts[2].x + pts[5].x) / 3, y: pts[0].y };
    const shoulderMid = { x: (pts[11].x + pts[12].x) / 2, y: (pts[11].y + pts[12].y) / 2 };
    const hipMid = { x: (pts[23].x + pts[24].x) / 2, y: (pts[23].y + pts[24].y) / 2 };

    // Render based on selected style
    switch (this.style) {
      case ROTOSCOPE_STYLES.SPIDER_GWEN_SUIT:
        this.renderSpiderGwenSuitStyle(ctx, pts, headCenter, shoulderMid, hipMid);
        break;
      case ROTOSCOPE_STYLES.NEON_VECTOR:
        this.renderNeonVectorStyle(ctx, pts, shoulderMid, hipMid);
        break;
      case ROTOSCOPE_STYLES.COMIC_INK:
        this.renderComicInkStyle(ctx, pts, width, height);
        break;
      case ROTOSCOPE_STYLES.LINE_ANIMATION:
        this.renderLineDrawAnimation(ctx, pts);
        break;
    }

    ctx.restore();
  }

  // Style 1: Spider-Gwen Hood & Suit Vector Tracing
  renderSpiderGwenSuitStyle(ctx, pts, headCenter, shoulderMid, hipMid) {
    ctx.save();
    ctx.shadowBlur = this.glowIntensity;
    ctx.shadowColor = this.primaryColor;

    // 1. Draw White Hood Vector Curve around Head
    const headRadius = Math.max(30, Math.abs(pts[11].x - pts[12].x) * 0.45);
    const hoodTop = { x: headCenter.x, y: headCenter.y - headRadius * 1.5 };
    const hoodLeft = { x: pts[11].x - 15, y: pts[11].y };
    const hoodRight = { x: pts[12].x + 15, y: pts[12].y };

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = this.strokeWidth + 1;

    ctx.beginPath();
    ctx.moveTo(hoodLeft.x, hoodLeft.y);
    // Pointed top Spider-Gwen hood
    ctx.quadraticCurveTo(headCenter.x - headRadius, headCenter.y - headRadius * 1.2, hoodTop.x, hoodTop.y);
    ctx.quadraticCurveTo(headCenter.x + headRadius, headCenter.y - headRadius * 1.2, hoodRight.x, hoodRight.y);
    ctx.quadraticCurveTo(headCenter.x, headCenter.y + headRadius * 0.8, hoodLeft.x, hoodLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Hood Inner Shadow (Magenta accents inside hood)
    ctx.fillStyle = '#ff007f';
    ctx.beginPath();
    ctx.ellipse(headCenter.x, headCenter.y + 10, headRadius * 0.7, headRadius * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Spider-Gwen Eye Mask Vector Outline (White/Cyan angled eyes)
    this.renderSpiderEye(ctx, pts[2].x - 12, pts[2].y, 16, -0.15); // Left Eye
    this.renderSpiderEye(ctx, pts[5].x + 12, pts[5].y, 16, 0.15);  // Right Eye

    // 3. Body Suit Vector Lines (Torso, Arms, Legs)
    ctx.strokeStyle = this.primaryColor;
    ctx.lineWidth = this.strokeWidth;

    // Torso Web Frame
    ctx.beginPath();
    ctx.moveTo(pts[11].x, pts[11].y);
    ctx.lineTo(pts[12].x, pts[12].y);
    ctx.lineTo(pts[24].x, pts[24].y);
    ctx.lineTo(pts[23].x, pts[23].y);
    ctx.closePath();
    ctx.stroke();

    // Arms Vector Paths
    const armPaths = [
      [11, 13, 15], // Left Arm (Shoulder -> Elbow -> Wrist)
      [12, 14, 16]  // Right Arm
    ];
    armPaths.forEach(path => {
      ctx.beginPath();
      ctx.moveTo(pts[path[0]].x, pts[path[0]].y);
      ctx.lineTo(pts[path[1]].x, pts[path[1]].y);
      ctx.lineTo(pts[path[2]].x, pts[path[2]].y);
      ctx.stroke();
    });

    // Legs Vector Paths
    const legPaths = [
      [23, 25, 27], // Left Leg (Hip -> Knee -> Ankle)
      [24, 26, 28]  // Right Leg
    ];
    legPaths.forEach(path => {
      ctx.beginPath();
      ctx.moveTo(pts[path[0]].x, pts[path[0]].y);
      ctx.lineTo(pts[path[1]].x, pts[path[1]].y);
      ctx.lineTo(pts[path[2]].x, pts[path[2]].y);
      ctx.stroke();
    });

    // 4. Spider Emblem on Chest Center
    this.renderChestEmblem(ctx, shoulderMid.x, shoulderMid.y + 40, 26);

    ctx.restore();
  }

  // Render Spider-Gwen Angled Eye Mask
  renderSpiderEye(ctx, x, y, size, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f3ff';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.quadraticCurveTo(0, -size * 1.3, size, -size * 0.4);
    ctx.quadraticCurveTo(0, size * 0.8, -size, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // Render Chest Spider Emblem
  renderChestEmblem(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#ff007f';
    ctx.fillStyle = '#ff007f';

    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.35, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spreading Vector Web Lines from Emblem
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const ang = (Math.PI * 2 * i) / 8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(ang) * size * 1.8, Math.sin(ang) * size * 1.8);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Style 2: Glowing Neon Vector Wireframe
  renderNeonVectorStyle(ctx, pts, shoulderMid, hipMid) {
    ctx.save();
    ctx.shadowBlur = this.glowIntensity + 5;
    ctx.shadowColor = this.primaryColor;
    ctx.strokeStyle = this.primaryColor;
    ctx.lineWidth = this.strokeWidth;

    const fullSkeleton = [
      [0,1],[1,2],[2,3],[3,7],        // Face
      [0,4],[4,5],[5,6],[6,8],
      [9,10],                        // Mouth
      [11,12],                       // Shoulders
      [11,13],[13,15],               // Left Arm
      [12,14],[14,16],               // Right Arm
      [11,23],[12,24],[23,24],       // Torso
      [23,25],[25,27],[27,29],[29,31], // Left Leg
      [24,26],[26,28],[28,30],[30,32]  // Right Leg
    ];

    ctx.beginPath();
    fullSkeleton.forEach(([i, j]) => {
      ctx.moveTo(pts[i].x, pts[i].y);
      ctx.lineTo(pts[j].x, pts[j].y);
    });
    ctx.stroke();

    // Joint Vector Nodes
    ctx.fillStyle = this.secondaryColor;
    ctx.shadowColor = this.secondaryColor;
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, this.strokeWidth * 1.2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // Style 3: Comic Ink & Halftone Shading
  renderComicInkStyle(ctx, pts, width, height) {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = this.strokeWidth + 2;

    // Draw bold black ink outlines
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000000';

    const torsoPts = [pts[11], pts[12], pts[24], pts[23]];
    ctx.beginPath();
    ctx.moveTo(torsoPts[0].x, torsoPts[0].y);
    torsoPts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Halftone Comic Dots Overlay
    ctx.fillStyle = 'rgba(0, 243, 255, 0.4)';
    const dotSpacing = 20;
    for (let x = 0; x < width; x += dotSpacing) {
      for (let y = 0; y < height; y += dotSpacing) {
        if (Math.sin(x * 0.05) + Math.cos(y * 0.05) > 0.5) {
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  // Style 4: Animating Stroke Motion (Lines drawing themselves)
  renderLineDrawAnimation(ctx, pts) {
    ctx.save();
    ctx.shadowBlur = this.glowIntensity;
    ctx.shadowColor = this.primaryColor;
    ctx.strokeStyle = this.primaryColor;
    ctx.lineWidth = this.strokeWidth;

    // Animated dashed stroke offset
    ctx.setLineDash([20, 10]);
    ctx.lineDashOffset = -this.animTime * 40;

    const paths = [
      [11, 13, 15], [12, 14, 16],
      [11, 12, 24, 23, 11],
      [23, 25, 27], [24, 26, 28]
    ];

    paths.forEach(p => {
      ctx.beginPath();
      ctx.moveTo(pts[p[0]].x, pts[p[0]].y);
      for (let i = 1; i < p.length; i++) {
        ctx.lineTo(pts[p[i]].x, pts[p[i]].y);
      }
      ctx.stroke();
    });

    ctx.restore();
  }
}
