import path from 'path';
import { existsSync } from 'node:fs';
import { parse } from 'querystring';
import { getFile } from './fileHandler.js';
import error from './middlewares/error.js'
import json from './middlewares/json.js'
import ResponseType from './enums/ResponseType.js'

// Роуты
import contactForm from './routes/v1/sendContact.js'
import getRequests from './routes/v1/getRequests.js'

// Мапа роутов
const routes = {
  '/v1/sendContact': {
    'POST': contactForm
  },

  '/v1/getRequests/': {
    'GET': getRequests
  }
}

const SITE_DIR = path.resolve('site');

async function GET(req, res) {
  let url = req.url;

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const route = routes[pathname];
  if (route) {
    await route['GET'](req, res);

    return;
  }

  if (!url.endsWith('/') && !path.extname(url)) {
    res.writeHead(301, { 'Location': url + '/' });
    res.end();

    return
  }

  if (url.endsWith('/')) {
    url = path.join(url, 'index.html');
  }

  const filePath = path.join(SITE_DIR, url);

  if (!existsSync(filePath)) {
    res.error(ResponseType.NOT_FOUND);

    return;
  }

  const file = await getFile(filePath, SITE_DIR);

  res.writeHead(200, {
    'Content-Type': file.contentType,
    'Cache-Control': 'public, max-age=604800, must-revalidate'
  });

  res.end(file.data);
}

async function POST(req, res) {
  const url = req.url;
  const route = routes[url];

  if (route) {
    await route['POST'](req, res);
  }
  else {
    res.error(ResponseType.NOT_FOUND);
  }
}

export async function handleRequest(req, res) {
  error(req, res);
  json(req, res);

  switch (req.method) {
    case 'GET':
      await GET(req, res);
      break;

    case 'POST':
      await POST(req, res);
      break;

    default:
      res.error(ResponseType.UNSUPPORTED_METHOD);
  }
}
