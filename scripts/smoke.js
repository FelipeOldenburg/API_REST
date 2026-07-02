const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../src/app');

const request = (port, path) => new Promise((resolve, reject) => {
  const req = http.request({ host: '127.0.0.1', port, path }, (res) => {
    let raw = '';

    res.on('data', (chunk) => {
      raw += chunk;
    });

    res.on('end', () => {
      resolve({
        status: res.statusCode,
        body: raw ? JSON.parse(raw) : null
      });
    });
  });

  req.on('error', reject);
  req.end();
});

(async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));

  try {
    const port = server.address().port;
    const status = await request(port, '/api/status');
    const blocked = await request(port, '/api/categorias');

    assert.equal(status.status, 200);
    assert.equal(status.body.status, 'online');
    assert.equal(blocked.status, 401);

    console.log('smoke ok');
  } finally {
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
