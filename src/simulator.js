// Dual Hand Mouse & Touch Simulator for Portal Reveal Banner

export class HandSimulator {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.enabled = false;

    this.leftHandPos = { x: 0.25, y: 0.4 };
    this.rightHandPos = { x: 0.75, y: 0.4 };
    this.activeHand = 'RIGHT'; // 'LEFT' or 'RIGHT'

    this.setupListeners();
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  setupListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.enabled) return;
      const rect = this.canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;

      if (this.activeHand === 'RIGHT') {
        this.rightHandPos.x = mx;
        this.rightHandPos.y = my;
      } else {
        this.leftHandPos.x = mx;
        this.leftHandPos.y = my;
      }
    });

    this.canvas.addEventListener('click', () => {
      if (!this.enabled) return;
      // Toggle active hand control on click
      this.activeHand = this.activeHand === 'RIGHT' ? 'LEFT' : 'RIGHT';
    });

    window.addEventListener('keydown', (e) => {
      if (!this.enabled) return;
      if (e.key === 'Tab' || e.key === ' ') {
        this.activeHand = this.activeHand === 'RIGHT' ? 'LEFT' : 'RIGHT';
        e.preventDefault();
      }
    });
  }

  // Generate simulated 21-point dual hand landmarks
  getSimulatedDualHandLandmarks() {
    const lx = this.leftHandPos.x;
    const ly = this.leftHandPos.y;

    const rx = this.rightHandPos.x;
    const ry = this.rightHandPos.y;

    const makeHand = (cx, cy) => [
      { x: cx, y: cy + 0.18, z: 0 },         // 0: Wrist
      { x: cx - 0.04, y: cy + 0.12, z: 0 },
      { x: cx - 0.06, y: cy + 0.08, z: 0 },
      { x: cx - 0.08, y: cy + 0.04, z: 0 },
      { x: cx - 0.1, y: cy, z: 0 },          // 4: Thumb tip
      { x: cx - 0.03, y: cy + 0.05, z: 0 },
      { x: cx - 0.03, y: cy - 0.02, z: 0 },
      { x: cx - 0.03, y: cy - 0.08, z: 0 },
      { x: cx - 0.03, y: cy - 0.14, z: 0 }, // 8: Index tip
      { x: cx, y: cy + 0.05, z: 0 },
      { x: cx, y: cy - 0.02, z: 0 },
      { x: cx, y: cy - 0.07, z: 0 },
      { x: cx, y: cy - 0.13, z: 0 },
      { x: cx + 0.03, y: cy + 0.05, z: 0 },
      { x: cx + 0.03, y: cy - 0.02, z: 0 },
      { x: cx + 0.03, y: cy - 0.06, z: 0 },
      { x: cx + 0.03, y: cy - 0.11, z: 0 },
      { x: cx + 0.06, y: cy + 0.06, z: 0 },
      { x: cx + 0.06, y: cy, z: 0 },
      { x: cx + 0.06, y: cy - 0.05, z: 0 },
      { x: cx + 0.06, y: cy - 0.10, z: 0 }
    ];

    return [makeHand(lx, ly), makeHand(rx, ry)];
  }
}
