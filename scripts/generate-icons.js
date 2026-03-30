// Script to generate Android app icons
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Red flame icon SVG (similar to Firexcheck branding)
const flameSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- White background with rounded corners -->
  <rect width="512" height="512" fill="#ffffff" rx="80"/>

  <!-- Red flame icon centered -->
  <g transform="translate(106, 56) scale(1.2)">
    <path
      d="M125 400c-55.23 0-100-44.77-100-100 0-62.5 50-87.5 50-150 0 0 25 25 25 75 12.5-25 25-50 25-100 50 50 75 100 75 175 0 50-25 75-25 75s25-12.5 25-50c25 37.5 25 75 25 75 0 55.23-44.77 100-100 100z"
      fill="#ef4444"
    />
  </g>
</svg>
`;

// Adaptive icon foreground (just the flame, no background)
const flameForegroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108">
  <!-- Flame centered for adaptive icon (with safe zone padding) -->
  <g transform="translate(24, 14) scale(0.55)">
    <path
      d="M125 400c-55.23 0-100-44.77-100-100 0-62.5 50-87.5 50-150 0 0 25 25 25 75 12.5-25 25-50 25-100 50 50 75 100 75 175 0 50-25 75-25 75s25-12.5 25-50c25 37.5 25 75 25 75 0 55.23-44.77 100-100 100z"
      fill="#ef4444"
    />
  </g>
</svg>
`;

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
  console.log('Generating Android app icons...');

  for (const [density, size] of Object.entries(sizes)) {
    const mipmapDir = path.join(androidResPath, `mipmap-${density}`);

    // Ensure directory exists
    if (!fs.existsSync(mipmapDir)) {
      fs.mkdirSync(mipmapDir, { recursive: true });
    }

    // Generate ic_launcher.png
    await sharp(Buffer.from(flameSvg))
      .resize(size, size)
      .png()
      .toFile(path.join(mipmapDir, 'ic_launcher.png'));

    // Generate ic_launcher_round.png (same for now)
    await sharp(Buffer.from(flameSvg))
      .resize(size, size)
      .png()
      .toFile(path.join(mipmapDir, 'ic_launcher_round.png'));

    console.log(`  Generated ${density} icons (${size}x${size})`);
  }

  // Generate foreground icons for adaptive icons
  for (const [density, size] of Object.entries(foregroundSizes)) {
    const mipmapDir = path.join(androidResPath, `mipmap-${density}`);

    await sharp(Buffer.from(flameForegroundSvg))
      .resize(size, size)
      .png()
      .toFile(path.join(mipmapDir, 'ic_launcher_foreground.png'));

    console.log(`  Generated ${density} foreground (${size}x${size})`);
  }

  console.log('Done! Android app icons generated.');
}

generateIcons().catch(console.error);
