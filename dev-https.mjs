import https from 'https';
import http from 'http';
import selfsigned from 'selfsigned';
import { createServer as createViteServer } from 'vite';

// Generate self-signed certificate
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

// Create Vite server
const viteServer = await createViteServer({
  server: { middlewareMode: true }
});

// Create HTTPS server that wraps Vite
const httpsServer = https.createServer(
  {
    key: pems.private,
    cert: pems.cert,
  },
  viteServer.middlewares
);

httpsServer.listen(8080, '::', () => {
  console.log('\n✨ HTTPS dev server running at https://localhost:8080/\n');
});

httpsServer.on('error', (err) => {
  console.error('HTTPS server error:', err);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  httpsServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
