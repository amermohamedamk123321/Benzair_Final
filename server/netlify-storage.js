import fs from 'fs';
import path from 'path';

let blobsAvailable = false;
let getStore;

// Try to import Netlify Blobs (only available in serverless environment)
try {
  const { getStore: netlifyGetStore } = await import('@netlify/blobs');
  getStore = netlifyGetStore;
  blobsAvailable = true;
  console.log('✓ Netlify Blobs initialized for serverless');
} catch (e) {
  console.log('⚠ Netlify Blobs not available, using file system fallback for local dev');
  blobsAvailable = false;
}

// Fallback file-based storage for local development
const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');

function ensureDir() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

function filePath(key) {
  ensureDir();
  return path.join(DATA_DIR, `${key}.json`);
}

// Local file-based storage functions
function loadLocal(key, fallback) {
  try {
    const p = filePath(key);
    if (!fs.existsSync(p)) return fallback;
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.warn('storage.load failed', e);
    return fallback;
  }
}

function saveLocal(key, data) {
  try {
    const p = filePath(key);
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.warn('storage.save failed', e);
    return false;
  }
}

// Netlify Blobs storage functions
async function loadBlob(key, fallback) {
  try {
    if (!blobsAvailable) return loadLocal(key, fallback);
    const store = getStore('data');
    const blob = await store.get(key);
    if (!blob) return fallback;
    const data = JSON.parse(blob);
    return data;
  } catch (e) {
    console.warn('netlify blobs load failed', e);
    return fallback;
  }
}

async function saveBlob(key, data) {
  try {
    if (!blobsAvailable) return saveLocal(key, data);
    const store = getStore('data');
    await store.set(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn('netlify blobs save failed', e);
    return false;
  }
}

export const storage = {
  load: blobsAvailable ? loadBlob : loadLocal,
  save: blobsAvailable ? saveBlob : saveLocal,
};

export default storage;
