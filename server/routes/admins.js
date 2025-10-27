import { Router } from 'express';
import { randomUUID } from 'crypto';
import storage from '../storage.js';

const router = Router();

let admins = storage.load('admins', [
  { id: randomUUID(), username: 'amermohamed', password: 'amk123321' },
  { id: randomUUID(), username: 'Amirkzd', password: 'amiradmin' }
]);

function sanitizeAdmin(a){
  return { id: String(a.id), username: String(a.username) };
}

router.get('/', (_req, res) => {
  res.json(admins.map(sanitizeAdmin));
});

// Create admin (returns sanitized)
router.post('/', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  if (admins.some(a=>a.username === username)) return res.status(400).json({ error: 'username exists' });
  const admin = { id: randomUUID(), username: String(username), password: String(password) };
  admins.push(admin);
  storage.save('admins', admins);
  res.status(201).json(sanitizeAdmin(admin));
});

// Authenticate
router.post('/auth', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const match = admins.find(a => a.username === username && a.password === password);
  if (!match) return res.status(401).json({ error: 'invalid credentials' });
  res.json(sanitizeAdmin(match));
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const admin = admins.find(a => a.id === id);
  if (!admin) return res.status(404).json({ error: 'not found' });
  const { username, password } = req.body || {};
  if (username !== undefined) admin.username = String(username || '');
  if (password !== undefined) admin.password = String(password || '');
  storage.save('admins', admins);
  res.json(sanitizeAdmin(admin));
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const before = admins.length;
  admins = admins.filter(a => a.id !== id);
  if (admins.length === before) return res.status(404).json({ error: 'not found' });
  storage.save('admins', admins);
  res.status(204).send();
});

export default router;
