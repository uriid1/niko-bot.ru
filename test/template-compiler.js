import { compileTemplate } from '../src/template-compiler.js'

// Шаблон для компиляции с новым синтаксисом
const template = `
<div>
  {{ if (user.isLoggedIn) then }}
    <div>Welcome, {{user.name}}!</div>
  {{ else }}
    <div>Please log in</div>
  {{ end }}
</div>
`

// Компилируем шаблон
const renderTemplate = await compileTemplate(template, 'template.html', '/root/path')

// Используем скомпилированный шаблон с разными данными
const html1 = renderTemplate({
  user: { isLoggedIn: true, name: 'John' },
})
console.log('Результат 1:', html1)

const html2 = renderTemplate({
  user: { isLoggedIn: false },
})
console.log('Результат 2:', html2)
