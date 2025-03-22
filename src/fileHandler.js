import { readFile } from 'node:fs/promises';
import path from 'path';
import { compileTemplate } from "./template-compiler.js"

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.txt': 'text/plain; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const RAW_REGEX = /\$raw\{([^}]+)\}/g;

function isTextFile(ext) {
  const textTypes = ['.html', '.css', '.js', '.json', '.txt', '.md', '.svg'];
  return textTypes.includes(ext);
}

async function getFile(filePath, rootPath) {
  const ext = path.extname(filePath).toLowerCase();

  let data;
  let contentType = MIME_TYPES[ext] || 'application/octet-stream';
  let isBinary = !isTextFile(ext);

  // Чтение файла в зависимости от его типа
  if (isBinary) {
    data = await readFile(filePath);
  }
  else {
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

  return { 
    data, 
    contentType, 
    isBinary 
  };
}

export { getFile };
