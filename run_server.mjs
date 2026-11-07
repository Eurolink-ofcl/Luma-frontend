import { createServer } from 'vite';

console.log('Starting Vite server for LUMA...');
const t0 = Date.now();

try {
  const server = await createServer({
    server: {
      port: 5173,
      host: true, // listen on all local IPs
    },
  });

  await server.listen();
  console.log(`\n>>> VITE SERVER READY in ${((Date.now() - t0) / 1000).toFixed(1)}s! <<<`);
  server.printUrls();
} catch (err) {
  console.error('Failed to start Vite server:', err);
}
