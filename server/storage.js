import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');

function ensureDir() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (_e) {}
}

function filePath(key) {
  ensureDir();
  return path.join(DATA_DIR, `${key}.json`);
}

function load(key, fallback) {
  try {
    const p = filePath(key);
    if (!fs.existsSync(p)) return fallback;
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw);
  } catch (_e) {
    return fallback;
  }
}

function save(key, data) {
  try {
    const p = filePath(key);
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (_e) {
    return false;
  }
}

export default { load, save };
