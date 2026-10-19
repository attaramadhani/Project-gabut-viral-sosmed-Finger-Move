// Spider-Verse Graphic Renderer Engine (Web Physics, Vector Suit, Glitch Shaders)

export class SpiderVerseRenderer {
  constructor() {
    this.particles = [];
    this.webStrands = [];
    this.popups = [];
    this.vectorLines = [];
    this.glitchIntensity = 0;
    this.spiderSenseTime = 0;
  }

  // Shoot a web strand from origin to target
  shootWeb(startX, startY, targetX, targetY) {
    const strand = {
      startX,
      startY,
      targetX,
      targetY,
      currX: startX,
      currY: startY,
      progress: 0,
      speed: 0.18,
      life: 1.0,
      splatRadius: 0,
      branches: []
    };

    // Generate web mesh sub-branches
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 + (Math.random() - 0.5) * 0.4;
      const len = 30 + Math.random() * 40;
      strand.branches.push({
        dx: Math.cos(angle) * len,
        dy: Math.sin(angle) * len
      });
    }

    this.webStrands.push(strand);

    // Spawn sparks/particles at origin
    for (let i = 0; i < 16; i++) {
      this.particles.push({
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: 1.0,
        decay: 0.03 + Math.random() * 0.04,
        color: Math.random() > 0.5 ? '#00f3ff' : '#ffffff',
        size: 3 + Math.random() * 4
      });
    }
  }

  // Trigger Comic Popup Text ("THWIP!", "BAM!", "SPIDER-SENSE!")
  spawnComicPopup(text, x, y, color = '#ff007f') {
    this.popups.push({
      text,
      x,
      y,
      scale: 0.2,
      maxScale: 1.2 + Math.random() * 0.4,
      rotation: (Math.random() - 0.5) * 0.4,
      alpha: 1.0,
      life: 1.0,
      color
    });
  }

  // Trigger Glitch Burst
  triggerGlitch(intensity = 1.0) {
    this.glitchIntensity = intensity;
  }

  update() {
    // 1. Update web strands
    for (let i = this.webStrands.length - 1; i >= 0; i--) {
      const s = this.webStrands[i];
      if (s.progress < 1.0) {
        s.progress += s.speed;
        s.currX = s.startX + (s.targetX - s.startX) * s.progress;
        s.currY = s.startY + (s.targetY - s.startY) * s.progress;
        if (s.progress >= 1.0) {
          s.splatRadius = 25;
        }
      } else {
        s.life -= 0.015;
      }
      if (s.life <= 0) {
        this.webStrands.splice(i, 1);
      }
    }

    // 2. Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.life -= p.decay;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 3. Update comic popups
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i];
      if (pop.scale < pop.maxScale) {
        pop.scale += (pop.maxScale - pop.scale) * 0.3;
      }
      pop.y -= 0.8;
      pop.life -= 0.02;
      pop.alpha = Math.max(0, pop.life);
      if (pop.life <= 0) {
        this.popups.splice(i, 1);
      }
    }

    // 4. Glitch decay
    if (this.glitchIntensity > 0) {
      this.glitchIntensity -= 0.05;
      if (this.glitchIntensity < 0) this.glitchIntensity = 0;
    }

    this.spiderSenseTime += 0.08;
  }

  // Draw Spider-Gwen Visual Effects onto Canvas
  render(ctx, width, height, handLandmarks = [], activeGesture = 'NONE') {
    ctx.save();

    // 1. Draw Spider-Verse Chromatic Aberration & Glitch filter if active
    if (this.glitchIntensity > 0) {
      this.renderGlitchEffect(ctx, width, height);
    }

    // 2. Draw Spider-Gwen Vector Suit & Hand Skeleton Overlay
    if (handLandmarks && handLandmarks.length > 0) {
      handLandmarks.forEach((landmarks) => {
        this.renderHandSuitOverlay(ctx, width, height, landmarks, activeGesture);
      });
    }

    // 3. Draw Web Strands & Splats
    this.renderWebStrands(ctx);

    // 4. Draw Particles
    this.renderParticles(ctx);

    // 5. Draw Comic Popups
    this.renderComicPopups(ctx);

    ctx.restore();
  }

  // Render Hand Vector Suit & Spider-Gwen Overlay
  renderHandSuitOverlay(ctx, width, height, landmarks, gesture) {
    const pts = landmarks.map(p => ({
      x: p.x * width,
      y: p.y * height
    }));

    // Hand connections (Joint skeleton)
    const connections = [
      [0,1],[1,2],[2,3],[3,4],        // Thumb
      [0,5],[5,6],[6,7],[7,8],        // Index
      [5,9],[9,10],[10,11],[11,12],   // Middle
      [9,13],[13,14],[14,15],[15,16], // Ring
      [13,17],[17,18],[18,19],[19,20],// Pinky
      [0,17]                          // Palm base
    ];

    // Neon Vector glow lines
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f3ff';
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 3;

    ctx.beginPath();
    connections.forEach(([i, j]) => {
      ctx.moveTo(pts[i].x, pts[i].y);
      ctx.lineTo(pts[j].x, pts[j].y);
    });
    ctx.stroke();

    // Magenta accents on finger tips (Spider-Gwen costume colors)
    const tips = [4, 8, 12, 16, 20];
    ctx.shadowColor = '#ff007f';
    ctx.fillStyle = '#ff007f';
    tips.forEach(idx => {
      ctx.beginPath();
      ctx.arc(pts[idx].x, pts[idx].y, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Palm Spider-Gwen Logo
    const palmCenter = {
      x: (pts[0].x + pts[5].x + pts[17].x) / 3,
      y: (pts[0].y + pts[5].y + pts[17].y) / 3
    };

    this.renderSpiderLogo(ctx, palmCenter.x, palmCenter.y, 22);

    // If SPIDER_SENSE gesture (✋), draw radiant comic warning arcs
    if (gesture === 'SPIDER_SENSE') {
      this.renderSpiderSenseArcs(ctx, palmCenter.x, palmCenter.y);
    }
  }

  // Draw Spider-Sense Lightning Arcs around head/hand
  renderSpiderSenseArcs(ctx, x, y) {
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ffd700';
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;

    const numArcs = 7;
    for (let i = 0; i < numArcs; i++) {
      const angle = (Math.PI * 2 * i) / numArcs + Math.sin(this.spiderSenseTime + i) * 0.2;
      const radius = 60 + Math.sin(this.spiderSenseTime * 2 + i) * 15;

      const ax = x + Math.cos(angle) * radius;
      const ay = y + Math.sin(angle) * radius;
      const bx = x + Math.cos(angle) * (radius + 35);
      const by = y + Math.sin(angle) * (radius + 35);

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      // Lightning zig-zag
      const midX = (ax + bx) / 2 + (Math.random() - 0.5) * 15;
      const midY = (ay + by) / 2 + (Math.random() - 0.5) * 15;
      ctx.lineTo(midX, midY);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }

    // Spider-Sense Floating Label
    ctx.font = '900 22px "Impact", "Arial Black", sans-serif';
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 10;
    ctx.textAlign = 'center';
    ctx.fillText('⚡ SPIDER-SENSE ⚡', x, y - 90);
    ctx.restore();
  }

  // Draw Spider-Gwen Spider Icon
  renderSpiderLogo(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff007f';
    ctx.fillStyle = '#ffffff';

    // Center body
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.35, size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spider legs
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    const legAngles = [-0.6, -0.2, 0.2, 0.6];
    legAngles.forEach(ang => {
      // Left leg
      ctx.beginPath();
      ctx.moveTo(-size * 0.3, 0);
      ctx.lineTo(-size * 0.8, Math.sin(ang) * size);
      ctx.lineTo(-size * 1.1, Math.sin(ang) * size * 1.5);
      ctx.stroke();

      // Right leg
      ctx.beginPath();
      ctx.moveTo(size * 0.3, 0);
      ctx.lineTo(size * 0.8, Math.sin(ang) * size);
      ctx.lineTo(size * 1.1, Math.sin(ang) * size * 1.5);
      ctx.stroke();
    });

    ctx.restore();
  }

  // Render Web Strands
  renderWebStrands(ctx) {
    this.webStrands.forEach(s => {
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00f3ff';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;

      // Main strand
      ctx.beginPath();
      ctx.moveTo(s.startX, s.startY);
      // Elastic curve wobble
      const midX = (s.startX + s.currX) / 2 + Math.sin(s.progress * Math.PI) * 15;
      const midY = (s.startY + s.currY) / 2 + Math.cos(s.progress * Math.PI) * 15;
      ctx.quadraticCurveTo(midX, midY, s.currX, s.currY);
      ctx.stroke();

      // Target Web Splat Mesh
      if (s.splatRadius > 0) {
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 2;
        s.branches.forEach(b => {
          ctx.beginPath();
          ctx.moveTo(s.targetX, s.targetY);
          ctx.lineTo(s.targetX + b.dx * (s.life), s.targetY + b.dy * (s.life));
          ctx.stroke();
        });
      }

      ctx.restore();
    });
  }

  // Render Particle Sparks
  renderParticles(ctx) {
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // Render Comic Text Popups ("THWIP!", "BAM!")
  renderComicPopups(ctx) {
    this.popups.forEach(pop => {
      ctx.save();
      ctx.translate(pop.x, pop.y);
      ctx.rotate(pop.rotation);
      ctx.scale(pop.scale, pop.scale);
      ctx.globalAlpha = pop.alpha;

      // Comic speech bubble background burst
      ctx.shadowBlur = 20;
      ctx.shadowColor = pop.color;
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = pop.color;
      ctx.lineWidth = 4;

      ctx.beginPath();
      const numPoints = 12;
      for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 * i) / numPoints;
        const r = i % 2 === 0 ? 65 : 45;
        const bx = Math.cos(angle) * r;
        const by = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(bx, by);
        else ctx.lineTo(bx, by);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Comic Text
      ctx.font = '900 32px "Impact", "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 0;
      ctx.fillText(pop.text, 0, 0);

      ctx.restore();
    });
  }

  // Render Glitch Screen Effect
  renderGlitchEffect(ctx, width, height) {
    ctx.save();
    const slices = 8;
    const sliceHeight = height / slices;

    for (let i = 0; i < slices; i++) {
      if (Math.random() < this.glitchIntensity * 0.7) {
        const dx = (Math.random() - 0.5) * 40 * this.glitchIntensity;
        ctx.drawImage(
          ctx.canvas,
          0, i * sliceHeight, width, sliceHeight,
          dx, i * sliceHeight, width, sliceHeight
        );
      }
    }

    // Cyan & Magenta chromatic line overlays
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = `rgba(0, 243, 255, ${0.15 * this.glitchIntensity})`;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = `rgba(255, 0, 127, ${0.15 * this.glitchIntensity})`;
    ctx.fillRect(5, 0, width, height);

    ctx.restore();
  }
}
