import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import storage from './storage.js';

const isNetlifyEnvironment = !!process.env.NETLIFY || !!process.env.NETLIFY_BUILD_BASE;

// Local fallback uploads directory for development
const UPLOADS_DIR = path.join(process.cwd(), 'server', 'uploads');

function ensureUploadsDir() {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

/**
 * Save a base64 data URL image to Netlify Blobs (or local filesystem in dev)
 * @param {string} dataUrl - Base64 data URL (e.g., "data:image/png;base64,...")
 * @returns {Promise<string|null>} - Returns the URL path (e.g., "/uploads/uuid.ext") or null on failure
 */
export async function saveImageUpload(dataUrl) {
  try {
    // Parse base64 data URL
    const match = /^data:(image\/(png|jpeg|jpg|webp|gif));base64,(.+)$/.exec(dataUrl);
    if (!match) {
      console.warn('Invalid data URL format');
      return null;
    }

    const ext = match[2] === 'jpeg' ? 'jpg' : match[2];
    const b64 = match[3];
    const buf = Buffer.from(b64, 'base64');
    const filename = `${randomUUID()}.${ext}`;

    if (isNetlifyEnvironment) {
      // Netlify: Store in Blobs
      try {
        await storage.saveAsync(`uploads/${filename}`, buf.toString('base64'));
        return `/uploads/${filename}`;
      } catch (e) {
        console.warn('Failed to save to Netlify Blobs:', e);
        return null;
      }
    } else {
      // Local development: Use file system
      ensureUploadsDir();
      const filePath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(filePath, buf);
      return `/uploads/${filename}`;
    }
  } catch (e) {
    console.warn('saveImageUpload failed:', e);
    return null;
  }
}

/**
 * Retrieve an uploaded image from Netlify Blobs or file system
 * @param {string} filename - Filename (e.g., "uuid.ext")
 * @returns {Promise<Buffer|null>} - Returns the file buffer or null if not found
 */
export async function getImageUpload(filename) {
  try {
    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return null;
    }

    if (isNetlifyEnvironment) {
      // Netlify: Retrieve from Blobs
      try {
        const data = await storage.loadAsync(`uploads/${filename}`, null);
        if (!data) return null;
        return Buffer.from(data, 'base64');
      } catch (e) {
        console.warn('Failed to load from Netlify Blobs:', e);
        return null;
      }
    } else {
      // Local development: Use file system
      const filePath = path.join(UPLOADS_DIR, filename);
      if (!fs.existsSync(filePath)) {
        return null;
      }
      return fs.readFileSync(filePath);
    }
  } catch (e) {
    console.warn('getImageUpload failed:', e);
    return null;
  }
}

export default { saveImageUpload, getImageUpload };
