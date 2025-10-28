import { Router } from "express";
import { randomUUID } from "crypto";
import storage from "../storage.js";
import { saveImageUpload } from "../uploads-handler.js";

const router = Router();

/** @type {Array<any>} */
const products = storage.load('products', []);

function computeAvailable(p) {
  const base = Number(p.baseStock || 0);
  const imported = p.imports.reduce((s, r) => s + Number(r.quantity || 0), 0);
  const exported = p.exports.reduce((s, r) => s + Number(r.quantity || 0), 0);
  return base + imported - exported;
}

function withComputed(p) {
  return { ...p, available: computeAvailable(p) };
}

router.get("/", (_req, res) => {
  res.json(products.map(withComputed));
});

router.get("/:id", (req, res) => {
  const p = products.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: "Product not found" });
  res.json(withComputed(p));
});

router.post("/", async (req, res) => {
  try {
    const { name, unit = "kg", price = 0, initialImportQty = 0, importDate, imageUrl = "", source = "bought", currency = "USD", initialStock = 0 } = req.body || {};
    if (!name) return res.status(400).json({ error: "name is required" });
    const now = new Date();
    let finalImage = String(imageUrl || "");
    if (finalImage.startsWith('data:image/')) {
      const saved = await saveImageUpload(finalImage);
      if (saved) finalImage = saved;
    }
    const product = {
      id: randomUUID(),
      name,
      unit,
      price: Number(price) || 0,
      imageUrl: finalImage,
      createdAt: now.toISOString(),
      imports: [],
      exports: [],
      baseStock: Number(initialStock) || 0,
      source: source === "imported" ? "imported" : "bought",
      currency: currency === "AFN" ? "AFN" : "USD"
    };
    if (product.source === "imported" && initialImportQty && Number(initialImportQty) > 0) {
      product.imports.push({ quantity: Number(initialImportQty), date: (importDate ? new Date(importDate) : now).toISOString() });
    }
    products.push(product);
    storage.save('products', products);
    res.status(201).json(withComputed(product));
  } catch (e) {
    console.error('POST /products failed:', e);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const p = products.find((x) => x.id === req.params.id);
    if (!p) return res.status(404).json({ error: "Product not found" });
    const { name, unit, price, imageUrl, baseStock, source, currency } = req.body || {};
    if (name !== undefined) p.name = name;
    if (unit !== undefined) p.unit = unit;
    if (price !== undefined) p.price = Number(price) || 0;
    if (imageUrl !== undefined) {
      let final = String(imageUrl || '');
      if (final.startsWith('data:image/')) {
        const saved = await saveImageUpload(final);
        if (saved) final = saved;
      }
      p.imageUrl = final;
    }
    if (baseStock !== undefined) p.baseStock = Math.max(0, Number(baseStock) || 0);
    if (source !== undefined) p.source = source === "imported" ? "imported" : "bought";
    if (currency !== undefined) p.currency = currency === "AFN" ? "AFN" : "USD";
    storage.save('products', products);
    res.json(withComputed(p));
  } catch (e) {
    console.error('PATCH /products/:id failed:', e);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.post("/:id/imports", (req, res) => {
  const p = products.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: "Product not found" });
  const { quantity, date } = req.body || {};
  const qty = Number(quantity);
  if (!qty || qty <= 0) return res.status(400).json({ error: "quantity must be > 0" });
  p.imports.push({ quantity: qty, date: (date ? new Date(date) : new Date()).toISOString() });
  storage.save('products', products);
  res.json(withComputed(p));
});

router.post("/:id/exports", (req, res) => {
  const p = products.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: "Product not found" });
  const { quantity, destination = "" , date } = req.body || {};
  const qty = Number(quantity);
  if (!qty || qty <= 0) return res.status(400).json({ error: "quantity must be > 0" });
  const available = computeAvailable(p);
  if (qty > available) return res.status(400).json({ error: "quantity exceeds available stock" });
  p.exports.push({ quantity: qty, destination, date: (date ? new Date(date) : new Date()).toISOString() });
  storage.save('products', products);
  res.json(withComputed(p));
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const before = products.length;
  const next = products.filter(p => p.id !== id);
  if (next.length === before) return res.status(404).json({ error: 'Product not found' });
  // mutate in place
  products.length = 0;
  products.push(...next);
  storage.save('products', products);
  res.status(204).send();
});

export const productsStore = { products };
export const productsHelpers = { computeAvailable };
export default router;
