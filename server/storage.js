import fs from 'fs';
import path from 'path';

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

export function load(key, fallback) {
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

export function save(key, data) {
  try {
    const p = filePath(key);
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.warn('storage.save failed', e);
    return false;
  }
}

export default { load, save };
