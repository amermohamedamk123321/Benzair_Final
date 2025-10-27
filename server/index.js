import "dotenv/config";
import express from "express";
import path from 'path';
import cors from "cors";
import { handleDemo } from "./routes/demo.js";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import heroRouter from "./routes/hero.js";
import awardsRouter from "./routes/awards.js";
import adminsRouter from "./routes/admins.js";
import assetsRouter from "./routes/assets.js";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // New APIs
  app.use("/api/products", productsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/hero", heroRouter);
  app.use('/api/awards', awardsRouter);
  app.use('/api/admins', adminsRouter);

  return app;
}
