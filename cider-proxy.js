#!/usr/bin/env node
/*
  cider-proxy — a tiny CORS shim so a browser app (even one served from
  https://claude.ai) can reach the Cider Apple Music local API.

  Why this exists:
    Cider's API lives at http://localhost:10767, but browsers block a web page
    from reading responses from another origin unless that origin sends CORS
    headers — and Chrome additionally gates "public site -> localhost" calls
    (Private Network Access). Cider doesn't send those headers, so the direct
    call from the page can fail. This proxy sits in front of Cider, forwards
    every request, and adds the headers the browser needs.

  Usage:
    1. Make sure Cider is running with its API enabled
       (Settings -> Connectivity -> Manage External Application Access).
    2. node cider-proxy.js
    3. In Cabin Mode -> Audio, set Server to:  http://localhost:10768
       (and your Cider token, if you kept auth on).

  No dependencies. Node 18+.
*/

const http = require('http');

const LISTEN_PORT = 10768;          // what Cabin Mode talks to
const CIDER = 'http://127.0.0.1:10767'; // where Cider actually listens

const server = http.createServer((req, res) => {
  // CORS + Private Network Access headers on every response
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apptoken, apitoken');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  res.setHeader('Vary', 'Origin');

  // Preflight
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  // Collect body then forward to Cider
  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    const target = new URL(req.url, CIDER);
    const headers = { ...req.headers, host: target.host };

    const proxyReq = http.request(target, { method: req.method, headers }, proxyRes => {
      // copy Cider's status + headers, but keep our CORS headers authoritative
      const out = { ...proxyRes.headers };
      delete out['access-control-allow-origin'];
      res.writeHead(proxyRes.statusCode, out);
      proxyRes.pipe(res);
    });
    proxyReq.on('error', err => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Cannot reach Cider at ' + CIDER, detail: err.message }));
    });
    if (body.length) proxyReq.write(body);
    proxyReq.end();
  });
});

server.listen(LISTEN_PORT, '127.0.0.1', () => {
  console.log(`cider-proxy running:  http://localhost:${LISTEN_PORT}  ->  ${CIDER}`);
  console.log('Set Cabin Mode > Audio > Server to http://localhost:' + LISTEN_PORT);
});
