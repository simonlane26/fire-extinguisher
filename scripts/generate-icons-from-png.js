// Script to generate Android app icons from a PNG image
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Source image path
const sourceImage = process.argv[2] || path.join(__dirname, 'app-icon.png');

// Android icon sizes
const sizes = {
  'mdpi': 48,
  'hdpi': 72,
  'xhdpi': 96,
  'xxhdpi': 144,
  'xxxhdpi': 192,
};

// Adaptive foreground sizes (108dp with density multiplier)
const foregroundSizes = {
  'mdpi': 108,
  'hdpi': 162,
  'xhdpi': 216,
  'xxhdpi': 324,
  'xxxhdpi': 432,
};

const androidResPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

async function generateIcons() {
  console.log('Generating Android app icons from:', sourceImage);

  if (!fs.existsSync(sourceImage)) {
    console.error('Source image not found:', sourceImage);
    process.exit(1);
  }

  // Read the source image
  const sourceBuffer = await sharp(sourceImage)
    .png()
    .toBuffer();

  for (const [density, size] of Object.entries(sizes)) {
    const mipmapDir = path.join(androidResPath, `mipmap-${density}`);

    // Ensure directory exists
    if (!fs.existsSync(mipmapDir)) {
      fs.mkdirSync(mipmapDir, { recursive: true });
    }

    // Generate ic_launcher.png
    await sharp(sourceBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(mipmapDir, 'ic_launcher.png'));

    // Generate ic_launcher_round.png with circular mask
    const roundedBuffer = await sharp(sourceBuffer)
      .resize(size, size, { fit: 'cover' })
      .composite([{
        input: Buffer.from(
          `<svg><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/></svg>`
        ),
        blend: 'dest-in'
      }])
      .png()
      .toFile(path.join(mipmapDir, 'ic_launcher_round.png'));

    console.log(`  Generated ${density} icons (${size}x${size})`);
  }

  // Generate foreground icons for adaptive icons
  for (const [density, size] of Object.entries(foregroundSizes)) {
    const mipmapDir = path.join(androidResPath, `mipmap-${density}`);

    // For adaptive icons, we need padding (safe zone is 66/108 of the icon)
    // The icon should be centered with some padding
    const iconSize = Math.floor(size * 0.7); // 70% of the foreground size for the actual icon
    const padding = Math.floor((size - iconSize) / 2);

    await sharp(sourceBuffer)
      .resize(iconSize, iconSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({
        top: padding,
        bottom: size - iconSize - padding,
        left: padding,
        right: size - iconSize - padding,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(mipmapDir, 'ic_launcher_foreground.png'));

    console.log(`  Generated ${density} foreground (${size}x${size})`);
  }

  console.log('Done! Android app icons generated.');
}

generateIcons().catch(console.error);
