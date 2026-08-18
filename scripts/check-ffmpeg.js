const ffmpeg = require('ffmpeg-static');
const ffprobe = require('ffprobe-static');
const { execSync } = require('child_process');

console.log('FFmpeg path:', ffmpeg);
console.log('FFprobe path:', ffprobe.path);

const ffmpegVer = execSync(`"${ffmpeg}" -version`).toString().split('\n')[0];
console.log('FFmpeg version output:', ffmpegVer);

const ffprobeVer = execSync(`"${ffprobe.path}" -version`).toString().split('\n')[0];
console.log('FFprobe version output:', ffprobeVer);
