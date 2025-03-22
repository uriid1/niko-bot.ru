document.addEventListener('DOMContentLoaded', () => {
  const themeToggleButton = document.getElementById('theme-toggle');
  const themeLink = document.getElementById('theme-link');
  const button = document.getElementById('theme-toggle')

  // Проверяем сохранённую тему в localStorage
  if (localStorage.getItem('theme') === 'dark') {
    themeLink.href = '/css/themes/dark.css';
    button.textContent = 'Light Theme';
  }

  themeToggleButton.addEventListener('click', () => {
    document.documentElement.classList.add("theme-transition");

    // Проверяем текущую тему и меняем на противоположную
    if (themeLink.href.includes('dark.css')) {
      themeLink.href = '/css/themes/light.css';
      localStorage.setItem('theme', 'light');

      button.textContent = 'Dark Theme';
    } else {
      themeLink.href = '/css/themes/dark.css';
      localStorage.setItem('theme', 'dark');

      console.log('ok')
      button.textContent = 'Light Theme';
    }

    // Убираем класс после окончания анимации
    // 300ms для 
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 300);
  });
});
