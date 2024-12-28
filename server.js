require('dotenv').config();
const express = require('express');
const next = require('next');
const { createServer } = require('http');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 4000;

app.prepare().then(() => {
  const server = express();

  // Mount your Express backend routes first
  const backendApp = require('./src/app/backend/server'); // Ensure this file exports an Express router
  server.use('/api', backendApp);

  // Handle all other requests with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the combined server
  createServer(server).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
