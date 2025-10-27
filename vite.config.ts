import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server/index.js";
import type { ViteDevServer } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    middlewareMode: true,
    fs: {
      allow: ["./client", "./shared","."],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

interface ExpressPlugin {
  name: string;
  apply: "serve";
  configureServer: (server: ViteDevServer) => void;
}

function expressPlugin(): ExpressPlugin {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}
