import { Router } from "express";
import { randomUUID } from "crypto";
import storage from "../storage.js";
import { saveImageUpload } from "../uploads-handler.js";

const router = Router();

// award shape: { id, imageUrl, title, description }
let awards = storage.load('awards', []);

awards = Array.isArray(awards) ? awards.map(a => ({ id: String(a.id || randomUUID()), imageUrl: String(a.imageUrl || ''), title: String(a.title || ''), description: String(a.description || '') })) : [];

router.get('/', (_req, res) => {
  res.json(awards);
});

router.post('/', (req, res) => {
  let { imageUrl, title = '', description = '' } = req.body || {};
  imageUrl = String(imageUrl || '').trim();
  if (imageUrl.startsWith('data:image/')) {
    const saved = saveDataUrlToUploads(imageUrl);
    if (saved) imageUrl = saved;
  }
  const item = { id: randomUUID(), imageUrl, title: String(title), description: String(description) };
  awards.push(item);
  storage.save('awards', awards);
  res.status(201).json(item);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { imageUrl, title, description } = req.body || {};
  const p = awards.find(a => a.id === id);
  if (!p) return res.status(404).json({ error: 'Award not found' });
  if (imageUrl !== undefined) {
    let img = String(imageUrl || '').trim();
    if (img.startsWith('data:image/')) {
      const saved = saveDataUrlToUploads(img);
      if (saved) img = saved;
    }
    p.imageUrl = img;
  }
  if (title !== undefined) p.title = String(title || '');
  if (description !== undefined) p.description = String(description || '');
  storage.save('awards', awards);
  res.json(p);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const before = awards.length;
  awards = awards.filter(a => a.id !== id);
  if (before === awards.length) return res.status(404).json({ error: 'Not found' });
  storage.save('awards', awards);
  res.status(204).send();
});

export const awardsStore = { awards };
export default router;
