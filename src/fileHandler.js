import path from 'path';
import { readFile } from 'node:fs/promises';
import { compileTemplate } from "./template-compiler.js"

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.txt': 'text/plain',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

function isTextFile(ext) {
  const textTypes = ['.html', '.css', '.js', '.json', '.txt', '.md', '.svg'];
  return textTypes.includes(ext);
}

async function getFile(filePath, rootPath) {
  const ext = path.extname(filePath).toLowerCase();

  let data;
  let contentType = MIME_TYPES[ext] || 'application/octet-stream';
  let isBinary = false;

  // Чтение файла в зависимости от его типа
  if (isTextFile(ext)) {
    contentType = contentType + '; charset=UTF-8'

    data = await readFile(filePath, 'utf-8');
    
    // Применение шаблонизаторов
    if (ext === '.html') {
      // Компилируем шаблон
      const renderTemplate = await compileTemplate(data, filePath, rootPath)

      const html = renderTemplate({
        opts: { devmode: parseInt(process.env.DEVMODE) !== 1 },
      })
      
      data = html;
    }
  }
  else {
    isBinary = true;
    data = await readFile(filePath);
  }

  return { 
    data, 
    contentType, 
    isBinary
  };
}

export { getFile };
