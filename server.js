const express = require('express');
const next = require('next');
const { createServer } = require('http');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 4000;

app.prepare().then(() => {
  const server = express();
  
  // Import and use your existing backend routes at root level
  const backendApp = require('./src/app/backend/server');
  server.use('/', backendApp);

  // Next-Auth routes will be automatically handled by Next.js at /api/auth/*

  // Handle all other routes with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  createServer(server).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on port ${port}`);
  });
});
