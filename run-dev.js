#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🚀 Starting Development Servers...\n');

// Start API server
const apiServer = spawn('node', ['api-server.js'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

// Start Vite dev server
const viteServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping servers...\n');
  apiServer.kill('SIGINT');
  viteServer.kill('SIGINT');
  process.exit(0);
});

// Wait for both servers
apiServer.on('close', (code) => {
  console.log(`API server exited with code ${code}`);
  viteServer.kill('SIGINT');
  process.exit(code);
});

viteServer.on('close', (code) => {
  console.log(`Vite server exited with code ${code}`);
  apiServer.kill('SIGINT');
  process.exit(code);
});