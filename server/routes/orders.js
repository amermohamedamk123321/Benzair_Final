import { Router } from "express";
import { randomUUID } from "crypto";

const router = Router();

import storage from "../storage.js";
/** @type {Array<any>} */
let orders = storage.load('orders', []);
import { productsStore, productsHelpers } from "./products.js";

router.get("/", (_req, res) => {
  res.json(orders);
});

router.post("/", (req, res) => {
  const { productId, productName, quantity, customerName, customerEmail, destination = "", notes = "" } = req.body || {};
  const qty = Number(quantity);
  if (!productId || !qty || qty <= 0 || !customerName) {
    return res.status(400).json({ error: "productId, quantity (>0), customerName are required" });
  }
  const product = productsStore.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: "Related product not found" });
  const available = productsHelpers.computeAvailable(product);
  if (qty > available) {
    return res.status(400).json({ error: "Order quantity exceeds available stock" });
  }
  const order = {
    id: randomUUID(),
    productId,
    productName: productName || product.name || "",
    quantity: qty,
    customerName,
    customerEmail: customerEmail || "",
    destination,
    notes,
    status: "pending",
    createdAt: new Date().toISOString(),
    history: [ { at: new Date().toISOString(), status: "pending" } ]
  };
  orders.push(order);
  storage.save('orders', orders);
  res.status(201).json(order);
});

router.patch("/:id", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  const { status } = req.body || {};
  if (status && ["pending","approved","completed","cancelled"].includes(status)) {
    if (order.status !== status) {
      // On first transition to approved/completed, record export if stock allows
      if ((status === "approved" || status === "completed") && !(order._exportApplied)) {
        const product = productsStore.products.find(p => p.id === order.productId);
        if (!product) return res.status(400).json({ error: "Related product not found" });
        const available = productsHelpers.computeAvailable(product);
        if (order.quantity > available) {
          return res.status(400).json({ error: "Order quantity exceeds available stock" });
        }
        product.exports.push({ quantity: order.quantity, destination: order.destination || "Customer Order", date: new Date().toISOString() });
        order._exportApplied = true;
      }
      order.status = status;
      order.history.push({ at: new Date().toISOString(), status });
    }
  }
  storage.save('orders', orders);
  res.json(order);
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const before = orders.length;
  orders = orders.filter(o => o.id !== id);
  if (orders.length === before) return res.status(404).json({ error: 'Order not found' });
  storage.save('orders', orders);
  res.status(204).send();
});

export default router;
