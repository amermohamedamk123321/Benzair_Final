import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'server', 'uploads');

function ensureUploadsDir() {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (_e) {}
}

// Save a base64 data URL image to local filesystem
export async function saveImageUpload(dataUrl) {
  try {
    const match = /^data:(image\/(png|jpeg|jpg|webp|gif));base64,(.+)$/.exec(dataUrl);
    if (!match) return null;

    const ext = match[2] === 'jpeg' ? 'jpg' : match[2];
    const b64 = match[3];
    const buf = Buffer.from(b64, 'base64');
    const filename = `${randomUUID()}.${ext}`;

    ensureUploadsDir();
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, buf);
    return `/uploads/${filename}`;
  } catch (_e) {
    return null;
  }
}

// Retrieve an uploaded image from local filesystem
export async function getImageUpload(filename) {
  try {
    if (filename.includes('..') || filename.includes('/')) return null;

    const filePath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath);
  } catch (_e) {
    return null;
  }
}

export default { saveImageUpload, getImageUpload };
