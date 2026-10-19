// Perspective Quadrilateral Mesh Texture Mapper for Canvas 2D

export class PerspectiveMeshMapper {
  // Render an image/canvas warped across a 4-point quadrilateral (v0, v1, v2, v3)
  // v0: Top-Left, v2: Top-Right, v3: Bottom-Right, v1: Bottom-Left
  static drawWarpedTexture(ctx, image, v0, v1, v2, v3) {
    if (!image) return;

    const imgWidth = image.width || image.videoWidth || 1280;
    const imgHeight = image.height || image.videoHeight || 720;

    // Split quadrilateral into 2 triangles: (v0, v2, v3) and (v0, v3, v1)
    this.drawTriangle(ctx, image,
      0, 0, imgWidth, 0, imgWidth, imgHeight,
      v0.x, v0.y, v2.x, v2.y, v3.x, v3.y
    );

    this.drawTriangle(ctx, image,
      0, 0, imgWidth, imgHeight, 0, imgHeight,
      v0.x, v0.y, v3.x, v3.y, v1.x, v1.y
    );
  }

  // Draw & affine transform a single texture triangle
  static drawTriangle(ctx, image, u0, v0, u1, v1, u2, v2, x0, y0, x1, y1, x2, y2) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.clip();

    // Calculate affine transformation matrix from texture coordinates (u,v) to canvas (x,y)
    const delta = (u0 * (v1 - v2) - v0 * (u1 - u2) + (u1 * v2 - u2 * v1));
    if (Math.abs(delta) < 0.0001) {
      ctx.restore();
      return;
    }

    const a = (x0 * (v1 - v2) - v0 * (x1 - x2) + (x1 * v2 - x2 * v1)) / delta;
    const b = (y0 * (v1 - v2) - v0 * (y1 - y2) + (y1 * v2 - y2 * v1)) / delta;
    const c = (u0 * (x1 - x2) - x0 * (u1 - u2) + (u1 * x2 - u2 * x1)) / delta;
    const d = (u0 * (y1 - y2) - y0 * (u1 - u2) + (u1 * y2 - u2 * y1)) / delta;
    const e = (x0 * (u1 * v2 - u2 * v1) - u0 * (x1 * v2 - x2 * v1) + v0 * (x1 * u2 - x2 * u1)) / delta;
    const f = (y0 * (u1 * v2 - u2 * v1) - u0 * (y1 * v2 - y2 * v1) + v0 * (y1 * u2 - y2 * u1)) / delta;

    ctx.transform(a, b, c, d, e, f);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
  }
}
