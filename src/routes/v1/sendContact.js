import path from 'path';
import { URL } from 'url';
import { pipeline } from 'node:stream';
import { appendFile, writeFile } from 'node:fs/promises';
import ResponseType from '#src/enums/ResponseType.js'
import logRequest from '#src/logRequest.js';

const LOG_FILE = path.join('site', 'pages', 'contact', 'log.txt');

async function contactForm(req, res) {
  // Логирование
  logRequest(req, res);

  if (req.headers['content-type'] !== 'application/json') {
    res.error(ResponseType.BAD_REQUEST);

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

      res.json(ResponseType.OK);
    }
    catch (err) {
      res.error();

      console.error(err);
    }
  })
}

export default contactForm;
