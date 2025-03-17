import { access, readFile } from 'node:fs/promises';
import path from 'path';
import defaultColors from './enums/defaultColors.js';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
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

async function processHTMLTemplate(content, filePath, rootPath) {
  // Обработка $raw{...}
  const rawJsMatches = content.match(RAW_REGEX);
  if (rawJsMatches) {
    for (const match of rawJsMatches) {
      const jsPath = match.match(/\$raw\{([^}]+)\}/)[1];

      // Проверка на абсолютный путь (начинается с /)
      let absolutePath;

      if (jsPath.startsWith('/')) {
        // Если путь начинается с /, считаем его от корня сайта
        absolutePath = path.join(rootPath, jsPath.substring(1));
      } else {
        // Иначе относительно текущего файла
        const fileDir = path.dirname(filePath);
        absolutePath = path.resolve(fileDir, jsPath);
      }

      try {
        const scriptContent = await readFile(absolutePath, 'utf-8');
        content = content.replace(match, scriptContent);
      }
      catch (error) {
        console.error(`Error loading ${jsPath}:`, error);
      }
    }
  }

  return content;
}

async function processCSSTemplate(content) {
  const colorVariableRegex = /\$([a-zA-Z_]\w*)/g;

  content = content.replace(colorVariableRegex, (match, variableName) => {
    if (defaultColors[variableName]) {
      return defaultColors[variableName];
    } else {
      // Если переменная не найдена в defaultColors, оставляем её без изменений
      console.warn(`Unknown color variable: ${variableName}`);
      return match;
    }
  });

  return content;
}


export async function getFile(filePath, rootPath) {
  try {
    await access(filePath);

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
        data = await processHTMLTemplate(data, filePath, rootPath);
      }
      else if (ext === '.css') {
        data = await processCSSTemplate(data);
      }
    }

    return { 
      data, 
      contentType, 
      isBinary 
    };
  }
  catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}