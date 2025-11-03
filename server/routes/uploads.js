import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const UPLOADS_DIR = path.join(process.cwd(), 'server', 'uploads');

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
