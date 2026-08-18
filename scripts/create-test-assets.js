const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');

const uploadsDir = path.join(__dirname, '..', 'uploads');
const assetsDir = path.join(__dirname, '..', 'assets');
const fontsDir = path.join(assetsDir, 'fonts');
const outputsDir = path.join(__dirname, '..', 'outputs');
const templatesDir = path.join(__dirname, '..', 'templates');

[uploadsDir, assetsDir, fontsDir, outputsDir, templatesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('Generating test landscape video (1920x1080 with audio)...');
const landscapeVideo = path.join(uploadsDir, 'sample-landscape.mp4');
if (!fs.existsSync(landscapeVideo)) {
  execSync(`"${ffmpeg}" -y -f lavfi -i testsrc=size=1920x1080:rate=30 -f lavfi -i sine=frequency=440:sample_rate=44100 -t 4 -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 128k "${landscapeVideo}"`);
  console.log('Created:', landscapeVideo);
}

console.log('Generating test portrait video (1080x1920 with audio)...');
const portraitVideo = path.join(uploadsDir, 'sample-portrait.mp4');
if (!fs.existsSync(portraitVideo)) {
  execSync(`"${ffmpeg}" -y -f lavfi -i testsrc=size=1080x1920:rate=30 -f lavfi -i sine=frequency=520:sample_rate=44100 -t 4 -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 128k "${portraitVideo}"`);
  console.log('Created:', portraitVideo);
}

console.log('Generating test square video (1080x1080 with audio)...');
const squareVideo = path.join(uploadsDir, 'sample-square.mp4');
if (!fs.existsSync(squareVideo)) {
  execSync(`"${ffmpeg}" -y -f lavfi -i testsrc=size=1080x1080:rate=30 -f lavfi -i sine=frequency=660:sample_rate=44100 -t 4 -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 128k "${squareVideo}"`);
  console.log('Created:', squareVideo);
}
