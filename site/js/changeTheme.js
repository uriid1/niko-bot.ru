document.addEventListener('DOMContentLoaded', () => {
  const themeToggleButton = document.getElementById('theme-toggle');
  const themeLink = document.getElementById('theme-link');
  const button = document.getElementById('theme-toggle')

  // Проверяем сохранённую тему в localStorage
  if (localStorage.getItem('theme') === 'dark') {
    themeLink.href = '/css/theme-dark.css';
    button.textContent = 'Light Theme';
  }

  themeToggleButton.addEventListener('click', () => {
    document.documentElement.classList.add("theme-transition");

    // Проверяем текущую тему и меняем на противоположную
    if (themeLink.href.includes('theme-dark.css')) {
      themeLink.href = '/css/theme-light.css';
      localStorage.setItem('theme', 'light');

      button.textContent = 'Dark Theme';
    } else {
      themeLink.href = '/css/theme-dark.css';
      localStorage.setItem('theme', 'dark');

      button.textContent = 'Light Theme';
    }

    // Убираем класс после окончания анимации
    // 300ms для 
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 300);
  });
});
