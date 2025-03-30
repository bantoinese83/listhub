const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const sourceImage = path.join(__dirname, '../public/icon.svg');
const publicDir = path.join(__dirname, '../public');

// Ensure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Generate icons
const generateIcons = async () => {
  try {
    // Ensure source image exists
    if (!fs.existsSync(sourceImage)) {
      throw new Error(`Source image not found: ${sourceImage}`);
    }

    // Ensure directories exist
    ensureDir(publicDir);
    ensureDir(path.join(publicDir, 'icons'));

    // Generate Android Chrome icons
    for (const size of sizes) {
      const outputPath = path.join(publicDir, `android-chrome-${size}x${size}.png`);
      await sharp(sourceImage)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`✓ Generated ${outputPath}`);
    }

    // Generate shortcut icons
    const shortcutIcons = [
      { name: 'post', size: 192 },
      { name: 'listings', size: 192 }
    ];

    for (const { name, size } of shortcutIcons) {
      const outputPath = path.join(publicDir, 'icons', `${name}.png`);
      await sharp(sourceImage)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`✓ Generated ${outputPath}`);
    }

    console.log('✨ All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
};

// Run the script
generateIcons(); 