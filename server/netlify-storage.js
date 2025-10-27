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

// Local file-based storage functions (synchronous)
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

// In-memory cache for Netlify Blobs
const cache = new Map();
const loadedFromBlobs = new Set();

// Netlify Blobs storage functions (with in-memory cache)
async function loadBlob(key, fallback) {
  try {
    if (!blobsAvailable) return loadLocal(key, fallback);
    
    // Return from cache if already loaded
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const store = getStore('data');
    const blob = await store.get(key);
    
    if (!blob) {
      cache.set(key, fallback);
      return fallback;
    }
    
    const data = JSON.parse(blob);
    cache.set(key, data);
    loadedFromBlobs.add(key);
    return data;
  } catch (e) {
    console.warn('netlify blobs load failed', e);
    // Return fallback on error
    if (cache.has(key)) {
      return cache.get(key);
    }
    cache.set(key, fallback);
    return fallback;
  }
}

async function saveBlob(key, data) {
  try {
    if (!blobsAvailable) return saveLocal(key, data);
    
    const store = getStore('data');
    await store.set(key, JSON.stringify(data));
    cache.set(key, data);
    loadedFromBlobs.add(key);
    return true;
  } catch (e) {
    console.warn('netlify blobs save failed', e);
    // Still update cache locally on error
    cache.set(key, data);
    return false;
  }
}

// Synchronous wrapper for initialization (uses local fallback or cache)
function loadSync(key, fallback) {
  if (blobsAvailable) {
    // If already in cache, return it
    if (cache.has(key)) {
      return cache.get(key);
    }
    // Cache the fallback for now, will be replaced when async load completes
    cache.set(key, fallback);
    return fallback;
  } else {
    // Local development: use file system
    return loadLocal(key, fallback);
  }
}

function saveSync(key, data) {
  if (blobsAvailable) {
    // Update in-memory cache immediately
    cache.set(key, data);
    // Async save to Netlify Blobs (fire and forget)
    saveBlob(key, data).catch(e => console.error('Failed to save to Netlify Blobs:', e));
    return true;
  } else {
    // Local development: use file system
    return saveLocal(key, data);
  }
}

// Ensure data from Netlify Blobs is loaded on first use
async function ensureLoaded(key, fallback) {
  if (blobsAvailable && !loadedFromBlobs.has(key) && !cache.has(key)) {
    await loadBlob(key, fallback);
  }
}

export const storage = {
  // Synchronous operations for module initialization and general use
  load: loadSync,
  save: saveSync,
  // Async operations for explicit async/await usage
  loadAsync: loadBlob,
  saveAsync: saveBlob,
  // Ensure data is loaded from Netlify Blobs
  ensureLoaded,
};

export default storage;
