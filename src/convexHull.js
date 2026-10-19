// 2D Convex Hull Polygon Generator for 10 Finger Tips (Andrew's Monotone Chain Algorithm)

export class ConvexHull {
  // Compute Convex Hull boundary polygon from array of 2D points [{x, y}, ...]
  static getHull(points) {
    if (points.length <= 3) return points;

    // Sort points lexicographically by X, then Y
    const sorted = [...points].sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);

    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

    // Build Lower Hull
    const lower = [];
    for (let p of sorted) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
        lower.pop();
      }
      lower.push(p);
    }

    // Build Upper Hull
    const upper = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      const p = sorted[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
        upper.pop();
      }
      upper.push(p);
    }

    // Remove last point of each half (duplicate of first point of other half)
    lower.pop();
    upper.pop();

    return lower.concat(upper);
  }
}
