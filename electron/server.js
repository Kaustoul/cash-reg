import { createServer } from 'http';
import { handler } from '../build/output/server/handler.js';

const server = createServer((req, res) => {
  handler(req, res).catch((err) => {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  });
});

const port = process.env.PORT || 4173;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
