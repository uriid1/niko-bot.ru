import path from 'path';
import { URL } from 'url';
import { pipeline } from 'node:stream';
import { appendFile, writeFile } from 'node:fs/promises';

const LOG_FILE = path.join('site', 'pages', 'test-form', 'log.txt');

async function testForm(req, res) {
  console.log(req.headers['content-type']);
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
    const { username, message } = data;

    const date = new Date().toISOString();
    const logEntry = `Дата: ${date} | Имя: ${username} | Сообщение: ${message}\n\n`;

    await appendFile(LOG_FILE, logEntry);

    res.writeHead(200);
    res.end('ok');
  })
}

export default testForm;
