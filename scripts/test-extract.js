import fs from 'fs';
import path from 'path';
import ffmpeg from 'ffmpeg-static';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const scratchDir = path.join(rootDir, 'scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

const videoFile = path.join(rootDir, 'uploads', '0102__2_-1787047841309.mp4');
const outFrame = path.join(scratchDir, 'test-frame.jpg');

try {
  execSync(`"${ffmpeg}" -y -ss 00:00:03 -i "${videoFile}" -vframes 1 "${outFrame}"`);
  console.log('Successfully extracted frame to:', outFrame);
  const stat = fs.statSync(outFrame);
  console.log('Frame file size:', stat.size, 'bytes');
} catch (e) {
  console.error('Extraction error:', e.message);
}
