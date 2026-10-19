// 100% Perfect 3D Folded Paper Ribbon Portal Engine
import { CameraGlitchShader } from './glitchShader.js';

export class PortalEngine {
  constructor() {
    this.shader = new CameraGlitchShader();

    // Finger Anchors (V0: Left Index Tip, V1: Left Thumb Tip, V2: Right Index Tip, V3: Right Thumb Tip)
    this.v0 = { x: 0, y: 0 };
    this.v1 = { x: 0, y: 0 };
    this.v2 = { x: 0, y: 0 };
    this.v3 = { x: 0, y: 0 };

    this.smoothFactor = 0.45;
  }

  updateVertices(leftHand, rightHand, width, height) {
    const tV0 = { x: leftHand[8].x * width, y: leftHand[8].y * height };  // Left Index Tip
    const tV1 = { x: leftHand[4].x * width, y: leftHand[4].y * height };  // Left Thumb Tip

    const tV2 = { x: rightHand[8].x * width, y: rightHand[8].y * height }; // Right Index Tip
    const tV3 = { x: rightHand[4].x * width, y: rightHand[4].y * height }; // Right Thumb Tip

    if (this.v0.x === 0 && this.v0.y === 0) {
      this.v0 = { ...tV0 };
      this.v1 = { ...tV1 };
      this.v2 = { ...tV2 };
      this.v3 = { ...tV3 };
    } else {
      this.v0.x += (tV0.x - this.v0.x) * this.smoothFactor;
      this.v0.y += (tV0.y - this.v0.y) * this.smoothFactor;

      this.v1.x += (tV1.x - this.v1.x) * this.smoothFactor;
      this.v1.y += (tV1.y - this.v1.y) * this.smoothFactor;

      this.v2.x += (tV2.x - this.v2.x) * this.smoothFactor;
      this.v2.y += (tV2.y - this.v2.y) * this.smoothFactor;

      this.v3.x += (tV3.x - this.v3.x) * this.smoothFactor;
      this.v3.y += (tV3.y - this.v3.y) * this.smoothFactor;
    }
  }

  render(ctx, video, width, height, multiHandLandmarks = []) {
    // STRICT RULE: MUST HAVE AT LEAST 2 HANDS DETECTED!
    // If 0 hands OR 1 hand is in frame -> DO NOT SHOW ANY EFFECT AT ALL!
    if (!multiHandLandmarks || multiHandLandmarks.length < 2) {
      this.v0 = { x: 0, y: 0 };
      this.v1 = { x: 0, y: 0 };
      this.v2 = { x: 0, y: 0 };
      this.v3 = { x: 0, y: 0 };
      return;
    }

    // Sort Left Hand vs Right Hand by X-coordinate
    const h1 = multiHandLandmarks[0];
    const h2 = multiHandLandmarks[1];
    const leftHand = h1[0].x < h2[0].x ? h1 : h2;
    const rightHand = h1[0].x < h2[0].x ? h2 : h1;

    this.updateVertices(leftHand, rightHand, width, height);

    ctx.save();

    // 1. Render 3D Folded Paper Ribbon (Top White Halftone Flap, Solarized Video Center, Bottom Navy Flap)
    this.shader.renderFoldedPaperRibbon(ctx, video, this.v0, this.v1, this.v2, this.v3, width, height);

    // 2. Crisp Paper Outer Vector Border
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#061d38';
    ctx.strokeStyle = '#fffdf7';
    ctx.lineWidth = 3.5;

    ctx.beginPath();
    ctx.moveTo(this.v0.x, this.v0.y);
    ctx.lineTo(this.v2.x, this.v2.y);
    ctx.lineTo(this.v3.x, this.v3.y);
    ctx.lineTo(this.v1.x, this.v1.y);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }
}
