import { readFile } from 'node:fs/promises';
import path from 'path';

// Предкомпилированные регулярные выражения для обработки шаблонов
const REGEX = {
  RAW: /raw\{([^}]+)\}/g,
  VAR: /\{\{([^}]+)\}\}/g,
  // Составные части для условного выражения
  IF_START: /\{\{\s*if\s+\(/,
  CONDITION: /([^)]+)/,
  IF_END: /\)\s+then\s*\}\}/,
  IF_CONTENT: /([\s\S]*?)/,
  ELSE_BLOCK: /(?:\{\{\s*else\s*\}\}([\s\S]*?))?/,
  END_BLOCK: /\{\{\s*end\s*\}\}/,
};

// Сборка полного регулярного выражения для условных конструкций
REGEX.IF_FULL = new RegExp(
  REGEX.IF_START.source +
    REGEX.CONDITION.source +
    REGEX.IF_END.source +
    REGEX.IF_CONTENT.source +
    REGEX.ELSE_BLOCK.source +
    REGEX.END_BLOCK.source,
  'g',
);

// Кэши для оптимизации производительности
const evalCache = new Map();
const varCache = new Map();
const fileCache = new Map();

/**
 * Основная функция обработки HTML шаблона
 * @param {string} content Содержимое шаблона
 * @param {string} filePath Путь к файлу шаблона
 * @param {string} rootPath Корневой путь проекта
 * @param {Object} data Данные для подстановки в шаблон
 * @returns {Promise<string>} Обработанный шаблон
 */
async function processHTMLTemplate(content, filePath, rootPath, data = {}) {
  // Обработка включений файлов
  content = await processRawIncludes(content, filePath, rootPath);

  // Обработка условных конструкций
  content = processConditionals(content, data);

  // Обработка переменных
  content = processVariables(content, data);

  return content;
}

/**
 * Обработка включений файлов через raw{...}
 * @param {string} content Содержимое шаблона
 * @param {string} filePath Путь к файлу шаблона
 * @param {string} rootPath Корневой путь проекта
 * @returns {Promise<string>} Обработанный шаблон с включенными файлами
 */
async function processRawIncludes(content, filePath, rootPath) {
  const rawMatches = content.match(REGEX.RAW);
  if (!rawMatches) return content;

  let result = content;

  for (const match of rawMatches) {
    const rawPath = match.match(/raw\{([^}]+)\}/)[1];

    // Определение абсолютного пути к включаемому файлу
    let absolutePath;

    if (rawPath.startsWith('/')) {
      // Для абсолютных путей (от корня проекта)
      absolutePath = path.join(rootPath, rawPath.substring(1));
    }
    else {
      // Для относительных путей (от текущего файла)
      const fileDir = path.dirname(filePath);
      absolutePath = path.resolve(fileDir, rawPath);
    }

    try {
      // Получение содержимого файла с использованием кэша
      let scriptContent;
      const cacheKey = `file:${absolutePath}`;

      if (fileCache.has(cacheKey)) {
        scriptContent = fileCache.get(cacheKey);
      }
      else {
        scriptContent = await readFile(absolutePath, 'utf-8');
        fileCache.set(cacheKey, scriptContent);
      }

      result = result.replace(match, scriptContent);
    }
    catch (error) {
      console.error(`Error loading ${rawPath}:`, error);
    }
  }

  return result;
}

/**
 * Обработка условных конструкций в шаблоне
 * @param {string} content Содержимое шаблона
 * @param {Object} data Данные для оценки условий
 * @returns {string} Обработанный шаблон
 */
function processConditionals(content, data) {
  // Создание копии строки для обработки
  let processedContent = content;

  // Ограничение количества итераций для предотвращения бесконечного цикла
  const MAX_ITERATIONS = 100;
  let iterations = 0;

  // Поиск всех условных блоков
  let matches = [...processedContent.matchAll(REGEX.IF_FULL)];

  while (matches.length > 0 && iterations < MAX_ITERATIONS) {
    iterations++;

    // Обработка совпадений с конца для сохранения корректных индексов
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      const fullMatch = match[0];
      const conditionText = match[1].trim();
      const ifContentText = match[2];
      const elseContentText = match[3] || '';

      // Оценка условия на основе переданных данных
      const result = evaluateCondition(conditionText, data);

      // Выбор соответствующего содержимого в зависимости от результата
      const replacement = result ? ifContentText : elseContentText;

      // Замена только текущего совпадения
      processedContent =
        processedContent.substring(0, match.index) +
        replacement +
        processedContent.substring(match.index + fullMatch.length);
    }

    // Поиск новых совпадений после замены
    matches = [...processedContent.matchAll(REGEX.IF_FULL)];
  }

  // Проверка на возможный бесконечный цикл
  if (iterations >= MAX_ITERATIONS) {
    console.error('<error: infinite loop> ');
  }

  return processedContent;
}

/**
 * Оценка условия в контексте переданных данных
 * @param {string} condition Условие для оценки
 * @param {Object} data Данные для оценки условия
 * @returns {boolean} Результат оценки условия
 */
function evaluateCondition(condition, data) {
  try {
    // Использование кэша для повышения производительности
    const cacheKey = `cond:${condition}`;
    let evalFunction;

    if (evalCache.has(cacheKey)) {
      evalFunction = evalCache.get(cacheKey);
    }
    else {
      // Создание функции для оценки условия в контексте данных
      const contextVars = Object.keys(data)
        .map((key) => `const ${key} = this.${key};`)
        .join('\n')
      evalFunction = new Function(`
        ${contextVars}
        return (${condition});
      `);

      // Сохранение функции в кэше
      evalCache.set(cacheKey, evalFunction);
    }

    return evalFunction.call(data);
  }
  catch (error) {
    console.error(`Error evaluating condition '${condition}':`, error);
    return false;
  }
}

/**
 * Обработка переменных {{variable}} в шаблоне
 * @param {string} content Содержимое шаблона
 * @param {Object} data Данные для подстановки переменных
 * @returns {string} Обработанный шаблон
 */
function processVariables(content, data) {
  let result = content;
  const matches = [...content.matchAll(REGEX.VAR)];

  for (const match of matches) {
    const fullMatch = match[0];
    const varName = match[1].trim();

    try {
      // Использование кэша для повышения производительности
      const cacheKey = `var:${varName}`;
      let evalVarFunction;

      if (varCache.has(cacheKey)) {
        evalVarFunction = varCache.get(cacheKey);
      }
      else {
        evalVarFunction = new Function(`
          with(this) { 
            return ${varName}; 
          }
        `);

        // Сохранение функции в кэше
        varCache.set(cacheKey, evalVarFunction);
      }

      const value = evalVarFunction.call(data);
      result = result.replace(fullMatch, value !== undefined ? value : fullMatch);
    }
    catch (error) {
      console.error(`Error evaluating variable '${varName}':`, error);
    }
  }

  return result;
}

/**
 * Очистка всех кэшей
 */
function clearCache() {
  evalCache.clear();
  varCache.clear();
  fileCache.clear();
}

// Экспорт функций и констант
export {
  REGEX,
  processHTMLTemplate,
  processRawIncludes,
  processConditionals,
  evaluateCondition,
  processVariables,
  clearCache,
}
