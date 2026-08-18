import fs from 'fs';
import path from 'path';
import ffprobe from 'ffprobe-static';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

const files = fs.readdirSync(uploadsDir);
console.log('Files in uploads:', files);

files.forEach(f => {
  if (!f.endsWith('.mp4')) return;
  const p = path.join(uploadsDir, f);
  try {
    const out = execSync(`"${ffprobe.path}" -v error -show_entries stream=codec_name,codec_type,pix_fmt,width,height,r_frame_rate:format=duration,size -of json "${p}"`).toString();
    const data = JSON.parse(out);
    console.log(`\n--- ${f} ---`);
    console.log(data);
  } catch (e) {
    console.error(`Error probing ${f}:`, e.message);
  }
});
