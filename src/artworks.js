// Premium Studio-Grade Spider-Man & Spider-Gwen Visual Filters

export class ArtworkGallery {
  constructor() {
    this.artworks = {};
    this.currentKey = 'SPIDER_GWEN_PREMIUM';
    this.customImage = null;

    this.generateArtworks();
  }

  setCurrent(key) {
    this.currentKey = key;
  }

  setCustomImage(imgElement) {
    this.customImage = imgElement;
    this.currentKey = 'CUSTOM';
  }

  generateArtworks() {
    this.artworks['SPIDER_GWEN_PREMIUM'] = this.createSpiderGwenPremiumFilter();
    this.artworks['MILES_MORALES_PREMIUM'] = this.createMilesMoralesPremiumFilter();
    this.artworks['CLASSIC_SPIDEY_PREMIUM'] = this.createClassicSpideyPremiumFilter();
  }

  // Filter 1: Spider-Gwen Masterpiece (Matching Screenshot 1 & 2)
  createSpiderGwenPremiumFilter() {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    // 1. Cyberpunk Spider-Verse Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1280, 720);
    bgGrad.addColorStop(0, '#0044ff');
    bgGrad.addColorStop(0.5, '#0d091e');
    bgGrad.addColorStop(1, '#ff007f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1280, 720);

    // Glowing City Grid
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.25)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < 1280; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, 720);
      ctx.stroke();
    }
    for (let y = 0; y < 720; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(1280, y);
      ctx.stroke();
    }

    // 2. Spider-Gwen Hooded Suit (White Hood & Pink Lining)
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#00f3ff';
    ctx.beginPath();
    ctx.moveTo(640, 100);
    ctx.quadraticCurveTo(420, 200, 420, 580);
    ctx.quadraticCurveTo(640, 650, 860, 580);
    ctx.quadraticCurveTo(860, 200, 640, 100);
    ctx.closePath();
    ctx.fill();

    // Magenta Hood Inner Lining
    ctx.fillStyle = '#ff007f';
    ctx.shadowColor = '#ff007f';
    ctx.beginPath();
    ctx.moveTo(640, 150);
    ctx.quadraticCurveTo(455, 230, 455, 550);
    ctx.quadraticCurveTo(640, 610, 825, 550);
    ctx.quadraticCurveTo(825, 230, 640, 150);
    ctx.closePath();
    ctx.fill();

    // White Spider-Gwen Mask Face
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(640, 420, 130, 160, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Pink Eye Lenses
    [570, 710].forEach((x, idx) => {
      const angle = idx === 0 ? -0.15 : 0.15;
      ctx.save();
      ctx.translate(x, 400);
      ctx.rotate(angle);

      // Outer Pink Rim
      ctx.fillStyle = '#ff007f';
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#ff007f';
      ctx.beginPath();
      ctx.moveTo(-52, 0);
      ctx.quadraticCurveTo(0, -72, 52, -24);
      ctx.quadraticCurveTo(0, 52, -52, 0);
      ctx.closePath();
      ctx.fill();

      // Inner White Lens
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-42, 0);
      ctx.quadraticCurveTo(0, -58, 42, -18);
      ctx.quadraticCurveTo(0, 42, -42, 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    // Tech HUD Numbers Overlays (?810100 & 2710100)
    ctx.font = '700 28px "Space Grotesk", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#00f3ff';
    ctx.fillText('?810100', 500, 240);

    return canvas;
  }

  // Filter 2: Miles Morales Spider-Verse (Black & Red Spray Paint Art)
  createMilesMoralesPremiumFilter() {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    // Dark Cyberpunk Red Background
    const bgGrad = ctx.createRadialGradient(640, 360, 50, 640, 360, 700);
    bgGrad.addColorStop(0, '#800016');
    bgGrad.addColorStop(0.6, '#260007');
    bgGrad.addColorStop(1, '#090714');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1280, 720);

    // Miles Morales Black & Red Mask Head
    ctx.fillStyle = '#141416';
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#ff0033';
    ctx.beginPath();
    ctx.ellipse(640, 360, 160, 210, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red Spray Paint Web Pattern Lines
    ctx.strokeStyle = '#ff0033';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff0033';
    for (let i = 0; i < 8; i++) {
      const ang = (Math.PI * 2 * i) / 8;
      ctx.beginPath();
      ctx.moveTo(640, 360);
      ctx.lineTo(640 + Math.cos(ang) * 160, 360 + Math.sin(ang) * 210);
      ctx.stroke();
    }

    // Miles White Angled Lenses
    [560, 720].forEach((x, idx) => {
      const angle = idx === 0 ? -0.18 : 0.18;
      ctx.save();
      ctx.translate(x, 340);
      ctx.rotate(angle);

      // Red Outer Eye Border
      ctx.fillStyle = '#ff0033';
      ctx.beginPath();
      ctx.moveTo(-55, 0);
      ctx.quadraticCurveTo(0, -80, 55, -25);
      ctx.quadraticCurveTo(0, 60, -55, 0);
      ctx.closePath();
      ctx.fill();

      // White Lens
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-45, 0);
      ctx.quadraticCurveTo(0, -65, 45, -20);
      ctx.quadraticCurveTo(0, 48, -45, 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    // Spider-Sense Lightning Arcs
    ctx.font = '900 36px "Impact", sans-serif';
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#ff0033';
    ctx.shadowBlur = 15;
    ctx.fillText('⚡ MILES MORALES ⚡', 450, 120);

    return canvas;
  }

  // Filter 3: Classic Red & Blue Spider-Man Comic
  createClassicSpideyPremiumFilter() {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    // Classic Red & Blue Comic Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1280, 720);
    bgGrad.addColorStop(0, '#cc0000');
    bgGrad.addColorStop(0.5, '#002699');
    bgGrad.addColorStop(1, '#990000');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1280, 720);

    // Classic Spidey Red Mask Head
    ctx.fillStyle = '#d60000';
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#000000';
    ctx.beginPath();
    ctx.ellipse(640, 360, 160, 210, 0, 0, Math.PI * 2);
    ctx.fill();

    // Classic Web Lines
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3.5;
    for (let i = 0; i < 10; i++) {
      const ang = (Math.PI * 2 * i) / 10;
      ctx.beginPath();
      ctx.moveTo(640, 360);
      ctx.lineTo(640 + Math.cos(ang) * 160, 360 + Math.sin(ang) * 210);
      ctx.stroke();
    }

    // Classic Large White Eye Lenses with Black Outline
    [555, 725].forEach((x, idx) => {
      const angle = idx === 0 ? -0.2 : 0.2;
      ctx.save();
      ctx.translate(x, 335);
      ctx.rotate(angle);

      // Black Outer Rim
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(-60, 0);
      ctx.quadraticCurveTo(0, -90, 60, -30);
      ctx.quadraticCurveTo(0, 70, -60, 0);
      ctx.closePath();
      ctx.fill();

      // White Inner Lens
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-48, 0);
      ctx.quadraticCurveTo(0, -74, 48, -24);
      ctx.quadraticCurveTo(0, 56, -48, 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    // Comic "THWIP!" Text
    ctx.font = '900 48px "Impact", sans-serif';
    ctx.fillStyle = '#ffff00';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeText('THWIP!', 550, 100);
    ctx.fillText('THWIP!', 550, 100);

    return canvas;
  }

  getCanvas() {
    if (this.currentKey === 'CUSTOM' && this.customImage) {
      return this.customImage;
    }
    return this.artworks[this.currentKey] || this.artworks['SPIDER_GWEN_PREMIUM'];
  }
}
