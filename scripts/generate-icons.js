import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const CRC32_TABLE = createCRC32Table();

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC32_TABLE[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crcData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crcVal = crc32(crcData);
  chunk.writeUInt32BE(crcVal, 8 + len);
  return chunk;
}

function createPng(width, height, isMaskable = false) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // Deflate
  ihdrData.writeUInt8(0, 11); // Filter
  ihdrData.writeUInt8(0, 12); // Interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw pixel data: each row starts with filter byte 0
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowBytes);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isMaskable ? 0.38 : 0.46);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Base background color: Slate-900 (#0f172a) with subtle gradient
      let r = 15;
      let g = 23;
      let b = 42;
      let a = 255;

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Letter "K" coordinates roughly inside central area
      // scale factor relative to 512
      const nx = (x / width) * 512;
      const ny = (y / height) * 512;

      // Draw stylized 'K'
      const inStem = (nx >= 140 && nx <= 200 && ny >= 120 && ny <= 392);
      
      // Upper arm: line from (190, 260) to (340, 150), thickness ~ 45
      const dArmUpper = Math.abs((ny - 150) * (340 - 190) - (nx - 340) * (260 - 150)) / Math.sqrt((340-190)**2 + (260-150)**2);
      const inArmUpper = dArmUpper < 26 && nx >= 190 && nx <= 350 && ny >= 140 && ny <= 280;

      // Lower leg: line from (230, 250) to (350, 400), thickness ~ 45
      const dLegLower = Math.abs((ny - 400) * (350 - 230) - (nx - 350) * (250 - 400)) / Math.sqrt((350-230)**2 + (250-400)**2);
      const inLegLower = dLegLower < 26 && nx >= 200 && nx <= 360 && ny >= 240 && ny <= 410;

      // Blue accent badge circle
      const bdx = nx - 340;
      const bdy = ny - 160;
      const inBadge = Math.sqrt(bdx * bdx + bdy * bdy) < 42;

      // Subtle border line
      if (nx >= 130 && nx <= 370 && ny >= 415 && ny <= 425) {
        // Blue bottom accent bar
        r = 37; g = 99; b = 235;
      } else if (inBadge) {
        // Royal Blue badge (#2563eb)
        r = 37; g = 99; b = 235;
      } else if (inStem || inArmUpper || inLegLower) {
        // Crisp White letter
        r = 255; g = 255; b = 255;
      } else {
        // Background gradient: dark slate to slightly brighter slate
        const grad = (y / height) * 20;
        r = Math.min(255, 15 + grad);
        g = Math.min(255, 23 + grad);
        b = Math.min(255, 42 + grad);
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. pwa-192x192.png
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, false));
console.log('Created pwa-192x192.png');

// 2. pwa-512x512.png
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, false));
console.log('Created pwa-512x512.png');

// 3. pwa-maskable-512x512.png
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
console.log('Created pwa-maskable-512x512.png');

// 4. apple-touch-icon.png (180x180)
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));
console.log('Created apple-touch-icon.png');

// 5. favicon.ico
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(64, 64, false));
console.log('Created favicon.ico');

console.log('All store & PWA icons generated successfully!');
