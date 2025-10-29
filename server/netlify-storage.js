import fs from 'fs';
import path from 'path';

let blobsAvailable = false;
let getStore;

// Check if we're in a Netlify serverless environment
const isNetlifyEnvironment = !!process.env.NETLIFY || !!process.env.NETLIFY_BUILD_BASE;

// Try to import Netlify Blobs (only available in serverless environment)
if (isNetlifyEnvironment) {
  try {
    const { getStore: netlifyGetStore } = await import('@netlify/blobs');
    getStore = netlifyGetStore;
    blobsAvailable = true;
    console.log('✓ Netlify Blobs storage enabled');
  } catch (e) {
    console.log('⚠ Netlify Blobs import failed, falling back to file system:', e.message);
    blobsAvailable = false;
  }
} else {
  console.log('⚠ Not in Netlify environment, using file system storage for local development');
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
const loadPromises = new Map();

// Netlify Blobs storage functions (with in-memory cache)
async function loadFromBlobs(key, fallback) {
  try {
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
    return data;
  } catch (e) {
    console.warn('Netlify Blobs load failed for key:', key, e);
    // Return fallback or cached value on error
    if (cache.has(key)) {
      return cache.get(key);
    }
    cache.set(key, fallback);
    return fallback;
  }
}

async function saveToBlobs(key, data) {
  try {
    const store = getStore('data');
    await store.set(key, JSON.stringify(data));
    cache.set(key, data);
    return true;
  } catch (e) {
    console.warn('Netlify Blobs save failed for key:', key, e);
    // Still update cache locally on error
    cache.set(key, data);
    return false;
  }
}

// Synchronous wrapper for initialization and regular use
function loadSync(key, fallback) {
  if (!blobsAvailable) {
    // Local development: use file system
    return loadLocal(key, fallback);
  }
  
  // Netlify environment: use cache or fallback
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  // Load from Blobs asynchronously in the background
  if (!loadPromises.has(key)) {
    loadPromises.set(key, loadFromBlobs(key, fallback));
  }
  
  // Return fallback immediately while loading
  cache.set(key, fallback);
  return fallback;
}

function saveSync(key, data) {
  if (!blobsAvailable) {
    // Local development: use file system
    return saveLocal(key, data);
  }
  
  // Netlify environment: update cache immediately, save asynchronously
  cache.set(key, data);
  
  // Fire and forget the async save
  saveToBlobs(key, data).catch(e => {
    console.error('Failed to persist to Netlify Blobs:', e);
  });
  
  return true;
}

// Ensure data from Netlify Blobs is loaded before using
async function ensureLoaded(key, fallback) {
  if (!blobsAvailable) return;
  
  if (!loadPromises.has(key)) {
    loadPromises.set(key, loadFromBlobs(key, fallback));
  }
  
  await loadPromises.get(key);
}

export const storage = {
  // Synchronous operations for module initialization and general use
  load: loadSync,
  save: saveSync,
  // Async operations for explicit async/await usage
  loadAsync: loadFromBlobs,
  saveAsync: saveToBlobs,
  // Ensure data is loaded from Netlify Blobs
  ensureLoaded,
};

export default storage;
