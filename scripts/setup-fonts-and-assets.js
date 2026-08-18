const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const assetsDir = path.join(__dirname, '..', 'assets');
const fontsDir = path.join(assetsDir, 'fonts');
const publicDir = path.join(__dirname, '..', 'public');
const publicFontsDir = path.join(publicDir, 'fonts');

[assetsDir, fontsDir, publicDir, publicFontsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Helper to download a file
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function setup() {
  console.log('Downloading fonts...');
  // Popular fonts from google fonts raw github or reliable cdn
  const fonts = [
    {
      name: 'Montserrat-ExtraBold.ttf',
      url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/Montserrat%5Bwght%5D.ttf'
    },
    {
      name: 'Anton-Regular.ttf',
      url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/anton/Anton-Regular.ttf'
    },
    {
      name: 'BebasNeue-Regular.ttf',
      url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/bebasneue/BebasNeue-Regular.ttf'
    },
    {
      name: 'Inter-Bold.ttf',
      url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf'
    }
  ];

  for (const font of fonts) {
    const assetDest = path.join(fontsDir, font.name);
    const publicDest = path.join(publicFontsDir, font.name);
    try {
      if (!fs.existsSync(assetDest)) {
        console.log(`Downloading ${font.name}...`);
        await downloadFile(font.url, assetDest);
      }
      if (!fs.existsSync(publicDest) && fs.existsSync(assetDest)) {
        fs.copyFileSync(assetDest, publicDest);
      }
    } catch (e) {
      console.warn(`Could not download ${font.name}: ${e.message}. Using system fallbacks.`);
    }
  }

  // Create placeholder logo.png and twibbon.png using FFmpeg lavfi if not present
  const logoPath = path.join(assetsDir, 'logo.png');
  const twibbonPath = path.join(assetsDir, 'twibbon.png');

  if (!fs.existsSync(logoPath)) {
    console.log('Creating placeholder logo.png...');
    // Create 320x100 transparent image with branding text or box
    execSync(`"${ffmpeg}" -y -f lavfi -i color=c=black@0.0:s=320x100 -vf "drawbox=x=10:y=10:w=300:h=80:color=gold@0.8:t=4,drawtext=text='BRAND LOGO':fontcolor=white:fontsize=32:x=(w-text_w)/2:y=(h-text_h)/2" -frames:v 1 "${logoPath}"`);
  }

  if (!fs.existsSync(twibbonPath)) {
    console.log('Creating placeholder twibbon.png (1080x1920)...');
    // Create 1080x1920 transparent PNG with top bar and bottom frame
    execSync(`"${ffmpeg}" -y -f lavfi -i color=c=black@0.0:s=1080x1920 -vf "drawbox=x=40:y=40:w=1000:h=1840:color=white@0.15:t=2" -frames:v 1 "${twibbonPath}"`);
  }

  // Copy to public assets so browser/remotion preview can also serve them directly
  const pubAssetsDir = path.join(publicDir, 'assets');
  if (!fs.existsSync(pubAssetsDir)) fs.mkdirSync(pubAssetsDir, { recursive: true });
  fs.copyFileSync(logoPath, path.join(pubAssetsDir, 'logo.png'));
  fs.copyFileSync(twibbonPath, path.join(pubAssetsDir, 'twibbon.png'));

  console.log('Asset setup completed successfully.');
}

setup().catch(console.error);
