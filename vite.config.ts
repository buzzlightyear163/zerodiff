import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Mock-API: samma fixture som frontend importerar serveras som JSON på /api/v1/proofs.json
// (dev) och skrivs ut i dist/ vid build. TODO(backend): ersätt med riktigt API.
const FIXTURE = fileURLToPath(new URL('./src/data/fixtures/proofs.json', import.meta.url));

function mockApi(): Plugin {
  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use('/api/v1/proofs.json', (_req, res) => {
        res.setHeader('content-type', 'application/json');
        res.end(readFileSync(FIXTURE));
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'api/v1/proofs.json', source: readFileSync(FIXTURE) });
    },
  };
}

export default defineConfig({
  plugins: [react(), mockApi()],
  server: { port: 5173, open: true },
});
