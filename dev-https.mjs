import http from 'http';
import { createServer as createViteServer } from 'vite';

const viteServer = await createViteServer({ server: { middlewareMode: true } });

const httpServer = http.createServer(viteServer.middlewares);

const host = '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 8080;
httpServer.listen(port, host, () => {
  console.log(`\n✨ Dev server running at http://${host}:${port}/\n`);
});

httpServer.on('error', (err) => {
  console.error('Dev server error:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
