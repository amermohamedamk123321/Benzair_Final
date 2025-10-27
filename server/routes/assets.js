import { Router } from "express";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();
const ASSETS_DIR = path.join(__dirname, '../../assets');

router.get('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    
    const filepath = path.join(ASSETS_DIR, filename);
    
    // Verify file exists and is within assets directory
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    const realpath = fs.realpathSync(filepath);
    const realAssetsDir = fs.realpathSync(ASSETS_DIR);
    if (!realpath.startsWith(realAssetsDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Set appropriate content type
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.webp': 'image/webp',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf'
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Asset serving error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
