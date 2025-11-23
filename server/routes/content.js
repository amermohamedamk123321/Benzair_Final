import express from 'express';
import storage from '../storage.js';

const router = express.Router();

// Get website content
router.get('/', (req, res) => {
  try {
    const data = storage.load('website-content', {});
    res.json(data);
  } catch (e) {
    console.error('Failed to load website content:', e);
    res.status(500).json({ error: 'Failed to load website content' });
  }
});

// Save website content
router.post('/', (req, res) => {
  try {
    const data = req.body;
    const success = storage.save('website-content', data);
    if (!success) {
      return res.status(500).json({ error: 'Failed to save website content' });
    }
    res.json({ success: true, data });
  } catch (e) {
    console.error('Failed to save website content:', e);
    res.status(500).json({ error: 'Failed to save website content' });
  }
});

// Update website content (PATCH)
router.patch('/', (req, res) => {
  try {
    const existing = storage.load('website-content', {});
    const updated = { ...existing, ...req.body };
    const success = storage.save('website-content', updated);
    if (!success) {
      return res.status(500).json({ error: 'Failed to save website content' });
    }
    res.json({ success: true, data: updated });
  } catch (e) {
    console.error('Failed to update website content:', e);
    res.status(500).json({ error: 'Failed to update website content' });
  }
});

export default router;
