import path from 'path';
import { parse } from 'querystring';
import { getFile } from './fileHandler.js';
import { existsSync } from 'node:fs';

// Роуты
import testForm from './routes/v1/testForm.js'

// Мапа роутов
const routes = {
  '/v1/test-form': {
    'POST': testForm
  }
}

const SITE_DIR = path.resolve('site');

async function GET(req, res) {
  let url = req.url;

  if (url.endsWith('/')) {
    url = path.join(url, 'index.html');
  }

  const filePath = path.join(SITE_DIR, url);

  if (!existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end('<h1>404 Not Found</h1>');

    return;
  }

  try {
    const file = await getFile(filePath, SITE_DIR);

    res.writeHead(200, {
      'Content-Type': file.contentType,
      'Cache-Control': 'public, max-age=604800, must-revalidate'
    });

    res.end(file.data);
  }
  catch (err) {
    console.log(err);

    res.writeHead(500, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end('<h1>500 Server Error</h1>');
  }
}

async function POST(req, res) {
  const url = req.url;
  const route = routes[url];
  if (route) {
    try {
      await route['POST'](req, res);
    }
    catch (err) {
      console.log(err);

      res.writeHead(500, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end('<h1>500 Server Error</h1>');
    }
  }
}

export async function handleRequest(req, res) {
  switch (req.method) {
    case 'GET':
      await GET(req, res);
      break;

    case 'POST':
      await POST(req, res);
      break;

    default:
      res.writeHead(405, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end('<h1>Unsupported method</h1>');
  }
}
