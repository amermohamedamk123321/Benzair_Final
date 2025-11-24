import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const router = Router();
const UPLOADS_DIR = path.join(process.cwd(), 'server', 'uploads');

function ensureUploadsDir() {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (_e) {}
}

// POST endpoint to upload image (accepts data URL or file)
router.post('/', async (req, res) => {
  try {
    const { dataUrl, filename } = req.body || {};

    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'dataUrl is required' });
    }

    const match = /^data:(image\/(png|jpeg|jpg|webp|gif));base64,(.+)$/.exec(dataUrl);
    if (!match) {
      return res.status(400).json({ error: 'Invalid data URL format' });
    }

    const ext = match[2] === 'jpeg' ? 'jpg' : match[2];
    const b64 = match[3];
    const buf = Buffer.from(b64, 'base64');
    const saveFilename = filename || `${randomUUID()}.${ext}`;

    ensureUploadsDir();
    const filePath = path.join(UPLOADS_DIR, saveFilename);

    fs.writeFileSync(filePath, buf);
    res.status(201).json({
      success: true,
      url: `/uploads/${saveFilename}`,
      filename: saveFilename
    });
  } catch (e) {
    console.error('POST /uploads failed:', e);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filepath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Upload not found' });
    }
    const buffer = fs.readFileSync(filepath);

    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.webp': 'image/webp',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(buffer);
  } catch (e) {
    console.error('Upload serving error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
