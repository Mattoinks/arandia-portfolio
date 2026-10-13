// Generates every site icon from the "A." brand mark (public/assets/icons/site-icon.jpg):
//   src/app/icon.png        browser tab favicon (rounded, transparent corners)
//   src/app/favicon.ico     legacy /favicon.ico (16 + 32 px PNG-in-ICO)
//   src/app/apple-icon.png  iOS home screen (full-bleed square — iOS rounds it)
//   public/assets/icons/icon-{192,512}.png  PWA manifest icons
// Run: node scripts/generate-app-icons.mjs
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const SOURCE = join(root, "public/assets/icons/site-icon.jpg");
const BACKGROUND = "#0c0c0b";

// The source art is a dark rounded square on white; this is the square's bounds (fractions of the image).
const SQUARE = { left: 0.104, top: 0.104, size: 0.792 };

async function markSquare() {
  const img = sharp(await readFile(SOURCE));
  const { width } = await img.metadata();
  const left = Math.round(width * SQUARE.left);
  const top = Math.round(width * SQUARE.top);
  const size = Math.round(width * SQUARE.size);
  return img.extract({ left, top, width: size, height: size }).toBuffer();
}

function roundedMask(size, radiusRatio) {
  const r = Math.round(size * radiusRatio);
  return Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff"/></svg>`,
  );
}

/** Rounded mark with transparent corners (tab favicon). */
async function rounded(mark, size) {
  return sharp(mark)
    .resize(size, size)
    .composite([{ input: roundedMask(size, 0.18), blend: "dest-in" }])
    .png()
    .toBuffer();
}

/** Full-bleed square: corners filled with the brand background (platforms apply their own mask). */
async function square(mark, size) {
  // Inset slightly so the source art's anti-aliased rounded corners never show.
  const inset = Math.round(size * 0.03);
  return sharp(mark)
    .resize(size + inset * 2, size + inset * 2)
    .extract({ left: inset, top: inset, width: size, height: size })
    .flatten({ background: BACKGROUND })
    .png()
    .toBuffer();
}

/** Minimal ICO container holding PNG images (supported by all modern browsers). */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + dir.length;
  pngs.forEach(({ size, data }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([header, dir, ...pngs.map((p) => p.data)]);
}

async function main() {
  const mark = await markSquare();

  await writeFile(join(root, "src/app/icon.png"), await rounded(mark, 64));
  await writeFile(
    join(root, "src/app/favicon.ico"),
    ico([
      { size: 16, data: await rounded(mark, 16) },
      { size: 32, data: await rounded(mark, 32) },
      { size: 48, data: await rounded(mark, 48) },
    ]),
  );
  await writeFile(join(root, "src/app/apple-icon.png"), await square(mark, 180));
  for (const size of [192, 512]) {
    await writeFile(join(root, `public/assets/icons/icon-${size}.png`), await square(mark, size));
  }
  console.log("Wrote icon.png, favicon.ico, apple-icon.png, icon-192.png, icon-512.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
