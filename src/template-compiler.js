import { REGEX, processRawIncludes } from './template-processor.js';

/**
 * Компилирует шаблон в функцию для более быстрого выполнения
 * @param {string} template Исходный шаблон
 * @param {string} filePath Путь к файлу шаблона
 * @param {string} rootPath Корневой путь проекта
 * @returns {Promise<Function>} Скомпилированная функция шаблона
 */
async function compileTemplate(template, filePath, rootPath) {
  // Предварительная обработка включений файлов, так как они статические
  const processedTemplate = await processRawIncludes(template, filePath, rootPath);

  // Компиляция шаблона в JavaScript функцию для повышения производительности
  const compiledFunction = createTemplateFunction(processedTemplate);

  // Возврат функции, которая принимает данные и возвращает готовый HTML
  return (data = {}) => {
    try {
      return compiledFunction(data);
    }
    catch (error) {
      console.error('Error rendering template:', error);
      return `Error rendering template: ${error.message}`;
    }
  }
}

/**
 * Создает оптимизированную функцию для рендеринга шаблона
 * @param {string} template Обработанный шаблон
 * @returns {Function} Функция рендеринга
 */
function createTemplateFunction(template) {
  // Разбиение шаблона на части для более эффективной обработки
  const parts = [];
  let lastIndex = 0;

  // Поиск всех условных блоков
  const matches = [...template.matchAll(REGEX.IF_FULL)];

  // Сортировка совпадений по индексу для обработки в правильном порядке
  matches.sort((a, b) => a.index - b.index);

  for (const match of matches) {
    // Добавление текста до условного блока
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: template.substring(lastIndex, match.index),
      })
    }

    // Добавление условного блока
    parts.push({
      type: 'condition',
      condition: match[1].trim(),
      ifContent: match[2],
      elseContent: match[3] || '',
    })

    lastIndex = match.index + match[0].length;
  }

  // Добавление оставшегося текста
  if (lastIndex < template.length) {
    parts.push({
      type: 'text',
      content: template.substring(lastIndex),
    })
  }

  // Создание регулярного выражения для обработки переменных
  const varRegex = REGEX.VAR;

  // Компиляция частей в функцию
  return (data) => {
    let output = '';

    for (const part of parts) {
      if (part.type === 'text') {
        // Обработка переменных в тексте
        let processedText = part.content;
        const varMatches = [...part.content.matchAll(varRegex)];

        for (let i = varMatches.length - 1; i >= 0; i--) {;
          const match = varMatches[i];
          const fullMatch = match[0];
          const varName = match[1].trim();

          try {
            const evalFunction = new Function(`
              with(this) { 
                return ${varName}; 
              }
            `);

            const value = evalFunction.call(data);

            processedText =
              processedText.substring(0, match.index) +
              (value !== undefined ? value : fullMatch) +
              processedText.substring(match.index + fullMatch.length);
          }
          catch (error) {
            console.error(`Error evaluating variable '${varName}':`, error);
          }
        }

        output += processedText;
      }
      else if (part.type === 'condition') {
        // Оценка условия
        let result;
        try {
          const evalFunction = new Function(`
            with(this) { 
              return (${part.condition}); 
            }
          `);

          result = evalFunction.call(data);
        }
        catch (error) {
          console.error(`Error evaluating condition '${part.condition}':`, error);
          result = false;
        }

        // Выбор содержимого в зависимости от результата
        const content = result ? part.ifContent : part.elseContent;

        // Обработка переменных в выбранном содержимом
        let processedContent = content;
        const varMatches = [...content.matchAll(varRegex)];

        for (let i = varMatches.length - 1; i >= 0; i--) {
          const match = varMatches[i];
          const fullMatch = match[0];
          const varName = match[1].trim();

          try {
            const evalFunction = new Function(`
              with(this) { 
                return ${varName}; 
              }
            `);

            const value = evalFunction.call(data);

            processedContent =
              processedContent.substring(0, match.index) +
              (value !== undefined ? value : fullMatch) +
              processedContent.substring(match.index + fullMatch.length);
          }
          catch (error) {
            console.error(`Error evaluating variable '${varName}':`, error);
          }
        }

        output += processedContent;
      }
    }

    return output;
  }
}

// Экспорт функций
export { compileTemplate };
