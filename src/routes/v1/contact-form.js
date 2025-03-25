import path from 'path';
import { URL } from 'url';
import { pipeline } from 'node:stream';
import { appendFile, writeFile } from 'node:fs/promises';

const LOG_FILE = path.join('site', 'pages', 'contact', 'log.txt');

async function contactForm(req, res) {
  if (req.headers['content-type'] !== 'application/json') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 400, reason: 'Bad Request' }));

    return;
  }

  // Данные из потока запроса
  let data = '';

  req.on('data', (chunk) => {
    data += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { name, telegram, message } = JSON.parse(data);

      const date = new Date().toISOString();
      const logEntry = `Дата: ${date} | Имя: ${name} | Telegram: ${telegram} | Сообщение: ${message}\n\n`;

      await appendFile(LOG_FILE, logEntry);

      res.writeHead(200);
      res.end('ok');
    } catch (err) {
      res.writeHead(500);
      res.end('error');

      console.error(err);
    }
  })
}

export default contactForm;
