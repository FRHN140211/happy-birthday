import type { BoothTemplate } from './templates';

export type BoothLayout = 'strip' | 'grid';

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function drawCover(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number, filter: string) {
  const sourceRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = image.naturalWidth;
  let sh = image.naturalHeight;

  if (sourceRatio > targetRatio) {
    sw = image.naturalHeight * targetRatio;
    sx = (image.naturalWidth - sw) / 2;
  } else {
    sh = image.naturalWidth / targetRatio;
    sy = Math.max(0, (image.naturalHeight - sh) * 0.38);
  }

  ctx.save();
  ctx.filter = filter;
  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
  ctx.restore();
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if ('decode' in image && typeof image.decode === 'function') {
        image.decode().then(() => resolve(image)).catch(() => resolve(image));
        return;
      }
      resolve(image);
    };
    image.onerror = () => reject(new Error('One of the selected photos could not be read. Please try again.'));
    image.src = source;
  });
}

// Paints the paper background + faint lines. Only call this ONCE, for the full canvas.
function drawPaperTexture(ctx: CanvasRenderingContext2D, width: number, height: number, base: string) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  for (let y = 0; y < height; y += 14) {
    ctx.fillStyle = y % 28 === 0 ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)';
    ctx.fillRect(0, y, width, 1);
  }

  for (let x = 0; x < width; x += 18) {
    ctx.fillStyle = x % 36 === 0 ? 'rgba(180,150,140,0.04)' : 'rgba(255,255,255,0.02)';
    ctx.fillRect(x, 0, 1, height);
  }
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
  ctx.beginPath();
  for (let index = 0; index < 10; index += 1) {
    const angle = (index / 10) * Math.PI * 2 - Math.PI / 2;
    const outerRadius = radius * (index % 2 === 0 ? 1 : 0.45);
    const px = x + Math.cos(angle) * outerRadius;
    const py = y + Math.sin(angle) * outerRadius;
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.32);
  ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size * 0.46);
  ctx.bezierCurveTo(x - size, y + size * 1.06, x - size * 0.18, y + size * 1.42, x, y + size * 1.78);
  ctx.bezierCurveTo(x + size * 0.18, y + size * 1.42, x + size, y + size * 1.06, x + size, y + size * 0.46);
  ctx.bezierCurveTo(x + size, y, x, y, x, y + size * 0.32);
  ctx.fillStyle = color;
  ctx.fill();
}

// FIXED: rotate around the flower center (translate first), not the canvas origin.
function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  for (let index = 0; index < 6; index += 1) {
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.72, size * 0.28, size * 0.9, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.36, 0, Math.PI * 2);
  ctx.fillStyle = '#fffaf5';
  ctx.fill();
  ctx.restore();
}

function drawRibbon(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width * 0.18, y);
  ctx.lineTo(x + width * 0.24, y + height * 0.38);
  ctx.lineTo(x + width * 0.3, y + height * 0.38);
  ctx.lineTo(x + width * 0.36, y + height);
  ctx.lineTo(x + width * 0.64, y + height);
  ctx.lineTo(x + width * 0.7, y + height * 0.38);
  ctx.lineTo(x + width * 0.76, y + height * 0.38);
  ctx.lineTo(x + width * 0.82, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.20)';
  ctx.fillRect(x + width * 0.08, y + height * 0.12, width * 0.84, 2);
}

// FIXED: fixed angle instead of Math.random() so re-renders look identical.
function drawWashiTape(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(-0.08);
  ctx.translate(-(x + width / 2), -(y + height / 2));
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = 'rgba(255,255,255,0.20)';
  ctx.fillRect(x + 5, y + 2, width - 10, 2.5);
  ctx.restore();
}

function drawBow(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.14);
  ctx.bezierCurveTo(x - size * 0.7, y + size * 0.14, x - size * 0.7, y - size * 0.54, x, y - size * 0.54);
  ctx.bezierCurveTo(x + size * 0.7, y - size * 0.54, x + size * 0.7, y + size * 0.14, x, y + size * 0.14);
  ctx.fill();
  ctx.fillRect(x - 2, y - size * 0.52, 4, size * 1.2);
  ctx.fillStyle = '#fffaf6';
  ctx.beginPath();
  ctx.arc(x - size * 0.46, y - size * 0.06, size * 0.18, 0, Math.PI * 2);
  ctx.arc(x + size * 0.46, y - size * 0.06, size * 0.18, 0, Math.PI * 2);
  ctx.fill();
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x - size * 0.32, y, size * 0.42, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(x + size * 0.16, y - size * 0.22, size * 0.38, Math.PI, Math.PI * 2);
  ctx.arc(x + size * 0.62, y, size * 0.38, Math.PI * 1.5, Math.PI * 0.5);
  ctx.closePath();
  ctx.fill();
}

function drawMiniStamp(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '700 8px Manrope, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(), 0, 0);
  ctx.restore();
}

// FIXED: no more drawPaperTexture here (it repainted the whole canvas).
function drawHeader(ctx: CanvasRenderingContext2D, width: number, template: BoothTemplate, date: string, name: string, y: number) {
  ctx.fillStyle = template.soft;
  ctx.fillRect(30, y + 20, width - 60, 38);

  ctx.fillStyle = template.accent;
  ctx.font = '700 9px Manrope, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('A LITTLE COLLECTION OF HAPPY MOMENTS', width / 2, y + 45);

  if (template.id === 'pink') {
    drawRibbon(ctx, 80, y + 82, width - 160, 18, '#f1c6d5');
    drawBow(ctx, width * 0.25, y + 78, 14, '#f3bfd2');
    drawBow(ctx, width * 0.75, y + 78, 14, '#f3bfd2');
    drawStar(ctx, width / 2, y + 57, 8, '#d88ca0');
  } else if (template.id === 'cherry') {
    drawRibbon(ctx, 54, y + 80, width - 108, 18, '#d9495f');
    drawStar(ctx, width * 0.27, y + 72, 7, '#d9495f');
    drawStar(ctx, width * 0.73, y + 72, 7, '#d9495f');
    drawFlower(ctx, width / 2, y + 87, 10, '#f2d5b0');
  } else if (template.id === 'scrapbook') {
    drawWashiTape(ctx, 34, y + 64, 120, 17, '#f9d9b8');
    drawWashiTape(ctx, width - 154, y + 64, 120, 17, '#d7d9f7');
    drawStar(ctx, width * 0.5, y + 72, 9, '#e2b090');
  } else {
    drawCloud(ctx, width * 0.25, y + 74, 34, '#f9fbff');
    drawCloud(ctx, width * 0.75, y + 74, 34, '#f9fbff');
    drawStar(ctx, width / 2, y + 64, 7, '#a8bfe8');
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = template.ink;
  ctx.font = '700 30px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(`${name.toUpperCase()} • BIRTHDAY`, width / 2, y + 122);
  ctx.font = '600 15px Manrope, sans-serif';
  ctx.fillStyle = template.accent;
  ctx.fillText(date.toUpperCase(), width / 2, y + 148);

  ctx.strokeStyle = 'rgba(147,123,117,0.26)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(36, y + 162);
  ctx.lineTo(width - 36, y + 162);
  ctx.stroke();
}

// FIXED: no more drawPaperTexture here either.
function drawFooter(ctx: CanvasRenderingContext2D, width: number, template: BoothTemplate, name: string, date: string, y: number) {
  ctx.fillStyle = template.soft;
  ctx.fillRect(30, y + 18, width - 60, 42);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = template.ink;
  ctx.font = '700 22px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Happy little memories', width / 2, y + 40);
  ctx.font = '600 11px Manrope, sans-serif';
  ctx.fillStyle = template.accent;
  ctx.fillText(`${date} • ${name}`, width / 2, y + 62);

  if (template.id === 'pink') {
    drawHeart(ctx, width * 0.2, y + 64, 11, '#f2b0c2');
    drawHeart(ctx, width * 0.8, y + 64, 11, '#f2b0c2');
  } else if (template.id === 'cherry') {
    drawMiniStamp(ctx, width * 0.2, y + 52, 'sweet', '#d9495f');
    drawMiniStamp(ctx, width * 0.8, y + 52, 'smile', '#d9495f');
  } else if (template.id === 'scrapbook') {
    drawStar(ctx, width * 0.2, y + 55, 6, '#e1bb8d');
    drawStar(ctx, width * 0.8, y + 55, 6, '#d6dff8');
  } else {
    drawCloud(ctx, width * 0.2, y + 55, 22, '#f8fbff');
    drawCloud(ctx, width * 0.8, y + 55, 22, '#f8fbff');
  }

  ctx.strokeStyle = 'rgba(147,123,117,0.26)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(36, y + 76);
  ctx.lineTo(width - 36, y + 76);
  ctx.stroke();
}

// FIXED: removed the translucent white box + outline that covered the photo.
function drawSlotDecorations(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, template: BoothTemplate) {
  if (template.id === 'pink') {
    drawBow(ctx, x + width * 0.16, y + 18, 12, '#f3bfd2');
    drawHeart(ctx, x + width * 0.85, y + height * 0.14, 10, '#f3bfd2');
    drawFlower(ctx, x + width * 0.18, y + height * 0.78, 8, '#f4d09d');
    drawStar(ctx, x + width * 0.82, y + height * 0.8, 7, '#d88ca0');
  } else if (template.id === 'cherry') {
    drawHeart(ctx, x + width * 0.18, y + 16, 9, '#d9495f');
    drawStar(ctx, x + width * 0.8, y + 18, 7, '#d9495f');
    drawFlower(ctx, x + width * 0.12, y + height * 0.76, 8, '#f0d7b9');
    ctx.fillStyle = '#f8e6dd';
    ctx.fillRect(x + width * 0.52, y + height * 0.13, width * 0.34, 10);
    ctx.fillStyle = '#d9495f';
    ctx.font = '700 8px Manrope, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('sweet', x + width * 0.61, y + height * 0.18);
  } else if (template.id === 'scrapbook') {
    drawWashiTape(ctx, x + width * 0.08, y + 18, width * 0.3, 12, '#f8dcbf');
    drawWashiTape(ctx, x + width * 0.56, y + 24, width * 0.24, 10, '#d7dff8');
    drawStar(ctx, x + width * 0.12, y + height * 0.82, 7, '#efc7a3');
    drawFlower(ctx, x + width * 0.84, y + height * 0.18, 8, '#d6d8f4');
    drawHeart(ctx, x + width * 0.76, y + height * 0.8, 9, '#efb3ae');
  } else {
    drawCloud(ctx, x + width * 0.12, y + 18, 20, 'rgba(255,255,255,0.8)');
    drawStar(ctx, x + width * 0.82, y + 28, 7, '#a8bfe8');
    drawFlower(ctx, x + width * 0.16, y + height * 0.8, 7, '#dce9ff');
    drawHeart(ctx, x + width * 0.82, y + height * 0.8, 9, '#d7dff9');
  }

  ctx.fillStyle = template.accent;
  ctx.font = '700 10px Manrope, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`${template.shortName.toUpperCase()}`, x + 18, y + height - 16);
}

function drawPhotoCard(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, image: HTMLImageElement, label: string, template: BoothTemplate, rotation: number) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(rotation);
  ctx.translate(-(x + width / 2), -(y + height / 2));

  ctx.fillStyle = 'rgba(88,62,54,0.10)';
  ctx.fillRect(x + 16, y + 22, width, height);

  ctx.save();
  ctx.shadowColor = 'rgba(75,54,51,0.18)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = template.id === 'cherry' ? '#fff6f2' : template.id === 'dreamy' ? '#f5fbff' : template.id === 'scrapbook' ? '#fffaf2' : '#fff7fa';
  roundedRect(ctx, x, y, width, height, 18);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = template.id === 'cherry' ? '#d75a67' : template.id === 'dreamy' ? '#9ab7d9' : template.id === 'scrapbook' ? '#d5b398' : '#f0bfd0';
  ctx.lineWidth = 1.4;
  roundedRect(ctx, x + 8, y + 8, width - 16, height - 16, 13);
  ctx.stroke();

  const paperX = x + 18;
  const paperY = y + 18;
  const paperW = width - 36;
  const paperH = height - 58;

  const frameTone = template.id === 'cherry' ? '#f9ece4' : template.id === 'dreamy' ? '#edf8ff' : template.id === 'scrapbook' ? '#fffaf1' : '#fff3f7';
  ctx.fillStyle = frameTone;
  ctx.fillRect(paperX + 10, paperY + 10, paperW - 20, paperH - 20);

  ctx.save();
  roundedRect(ctx, paperX, paperY, paperW, paperH, 10);
  ctx.clip();
  drawCover(ctx, image, paperX, paperY, paperW, paperH, template.filter || 'saturate(1.15) contrast(1.12)');
  ctx.restore();

  ctx.strokeStyle = template.accent;
  ctx.lineWidth = 2;
  roundedRect(ctx, paperX + 10, paperY + 10, paperW - 20, paperH - 20, 8);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillRect(paperX + 16, paperY + paperH - 22, paperW - 32, 20);
  ctx.fillStyle = template.accent;
  ctx.font = '700 10px Manrope, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(label.toUpperCase(), x + width - 24, y + height - 18);

  if (template.id === 'pink') {
    drawBow(ctx, x + 26, y + 28, 12, '#f3bfd2');
    drawHeart(ctx, x + width - 34, y + 32, 9, '#f3bfd2');
  } else if (template.id === 'cherry') {
    drawMiniStamp(ctx, x + width - 34, y + 30, 'sweet', '#d9495f');
  } else if (template.id === 'scrapbook') {
    drawStar(ctx, x + 24, y + height - 22, 6, '#efc7a3');
    drawFlower(ctx, x + width - 28, y + 34, 8, '#d6d8f4');
  } else {
    drawCloud(ctx, x + 30, y + 34, 18, 'rgba(255,255,255,0.8)');
    drawStar(ctx, x + width - 24, y + 28, 7, '#a8bfe8');
  }

  drawSlotDecorations(ctx, paperX + 8, paperY + 8, paperW - 16, paperH - 16, template);
  ctx.restore();
}

export async function composePhotobooth(sources: string[], template: BoothTemplate, layout: BoothLayout, date: string, name: string): Promise<Blob> {
  if (sources.length !== 4) throw new Error('Four photos are needed to make your little memory.');

  // If you do NOT see this line in the browser Console (F12), the old file is still running.
  console.log('[photobooth] composition v2 loaded, photos:', sources.length);

  await document.fonts.ready;
  const images = await Promise.all(sources.map((source) => loadImage(source)));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser cannot create a photo canvas.');

  const margin = 38;
  const gap = 18;
  const headerHeight = 180;
  const footerHeight = 108;

  const layoutConfig = {
    strip: {
      width: 760,
      // 4 slots * 299 + 3 gaps * 18 = 1250
      height: margin + headerHeight + gap + 1250 + gap + footerHeight + margin,
      slots: Array.from({ length: 4 }, (_, index) => ({
        x: margin,
        y: margin + headerHeight + gap + index * (299 + gap),
        width: 684,
        height: 299,
      })),
      rotations: [-0.025, 0.03, -0.02, 0.025],
    },
    grid: {
      width: 1200,
      // 2 rows * 367 + 1 gap * 26 = 760
      height: margin + headerHeight + gap + 760 + gap + footerHeight + margin,
      slots: Array.from({ length: 4 }, (_, index) => ({
        x: 110 + (index % 2) * (470 + 40),
        y: margin + headerHeight + gap + Math.floor(index / 2) * (367 + 26),
        width: 470,
        height: 367,
      })),
      rotations: [-0.04, 0.035, 0.03, -0.04],
    },
  } as const;

  const config = layoutConfig[layout];
  canvas.width = config.width;
  canvas.height = config.height;

  // Draw order: background (once) -> header -> photos -> footer
  drawPaperTexture(ctx, canvas.width, canvas.height, template.paper);
  drawHeader(ctx, canvas.width, template, date, name, margin);

  config.slots.forEach((slot, index) => {
    const label = `${name.toUpperCase()} • ${String(index + 1).padStart(2, '0')}`;
    drawPhotoCard(ctx, slot.x, slot.y, slot.width, slot.height, images[index], label, template, config.rotations[index]);
  });

  drawFooter(ctx, canvas.width, template, name, date, canvas.height - margin - footerHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('The photo could not be exported. Please try another browser.'));
    }, 'image/png');
  });
}