// One-off generator for PWA app icons — composites the existing "M" logo
// mark onto the site's dark background at the standard manifest sizes.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const BACKGROUND = "#09090b";
const SIZES = [192, 512];

async function makeIcon(logoBuf, size) {
  const logoSize = Math.round(size * 0.6);
  const logo = await sharp(logoBuf).resize(logoSize, logoSize).toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer();
}

async function main() {
  const logoBuf = await readFile(join(root, "public/assets/images/og/WHITEM.jpg"));
  const outDir = join(root, "public/assets/icons");
  await mkdir(outDir, { recursive: true });

  for (const size of SIZES) {
    const icon = await makeIcon(logoBuf, size);
    await writeFile(join(outDir, `icon-${size}.png`), icon);
    console.log(`Wrote public/assets/icons/icon-${size}.png`);
  }

  // Apple touch icon — Next.js picks this up automatically from app/apple-icon.png.
  const appleIcon = await makeIcon(logoBuf, 180);
  await writeFile(join(root, "src/app/apple-icon.png"), appleIcon);
  console.log("Wrote src/app/apple-icon.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
