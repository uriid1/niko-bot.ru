import http from 'http';
import { handleRequest } from './src/requestHandler.js';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  handleRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`Server run localhost:${PORT}`);
});
