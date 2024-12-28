const express = require('express');
const next = require('next');
const { createServer } = require('http');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 4000;

app.prepare().then(() => {
  const server = express();
  
  // Handle Next.js routes first
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Then handle your Express backend routes
  const backendApp = require('./src/app/backend/server');
  server.use('/api', backendApp);

  createServer(server).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on port ${port}`);
  });
});
