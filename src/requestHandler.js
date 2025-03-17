import path from 'path';
import { URL } from 'url';
import { appendFile, writeFile, access } from 'node:fs/promises';
import { pipeline } from 'node:stream';
import { parse } from 'querystring';
import Busboy from 'busboy';
import { getFile } from './fileHandler.js';

const SITE_DIR = path.resolve('site');

async function GET(req, res) {
  let urlPath = req.url.split('?')[0];

  if (!urlPath.endsWith('/') && !path.extname(urlPath)) {
    res.writeHead(301, { 'Location': urlPath + '/' });
    res.end();
    return;
  }

  if (urlPath.endsWith('/')) {
    urlPath = path.join(urlPath, 'index.html');
  }

  const filePath = path.join(SITE_DIR, urlPath);
  const file = await getFile(filePath, SITE_DIR);

  if (!file) {
    res.writeHead(404, {'Content-Type': 'text/html; charset=UTF-8' });
    res.end('<h1>404 Not Found</h1>');
    return;
  }

  res.writeHead(200, {
    'Content-Type': file.contentType,
    'Cache-Control': 'public, max-age=604800, must-revalidate'
  });
  res.end(file.data);
}

const LOG_FILE = path.join('site', 'pages', 'test-form', 'log.txt');

async function POST(req, res) {
  const referer = req.headers.referer || '';
  const refererUrl = new URL(referer);

  // Тестовая запись лога
  if (refererUrl.pathname === '/pages/test-form/') {
    const busboy = Busboy({ headers: req.headers });

    const formData = {};
    busboy.on('field', (fieldname, val) => {
      formData[fieldname] = val;
    });

    busboy.on('finish', async () => {
      const date = new Date().toISOString();
      const logEntry = `Дата: ${date} | Имя: ${formData.username} | Сообщение: ${formData.message}\n\n`;

      try {
        await appendFile(LOG_FILE, logEntry);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end('<h1>Форма отправлена успешно!</h1>');
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end('<h1>Ошибка сервера</h1>');
      }
    });

    pipeline(req, busboy, (err) => {
      if (err) console.error('Pipeline error:', err);
    });
  } else {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end('<h1>Некорректный запрос</h1>');
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
