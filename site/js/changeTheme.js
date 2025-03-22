const themes = [
  { text: 'Light', value: 'light.css' },
  { text: 'Dark', value: 'dark.css' },
  { text: 'Biotech', value: 'biotech.css' },
  { text: 'Cyberpunk', value: 'cyberpunk.css' },
  { text: 'Dark blue', value: 'dark-blue.css' },
  { text: 'Dark pink', value: 'dark-pink.css' },
  { text: 'Desert', value: 'desert.css' },
  { text: 'Emerald gold', value: 'emerald-gold.css' },
  { text: 'Green dark', value: 'green-dark.css' },
  { text: 'Grunge', value: 'grunge.css' },
  { text: 'Hi-tech', value: 'hi-tech.css' },
  { text: 'Monochrome', value: 'monochrome.css' },
  { text: 'Moon', value: 'moon.css' },
  { text: 'Neon', value: 'neon.css' },
  { text: 'Red', value: 'red.css' },
  { text: 'Retro', value: 'retro.css' },
  { text: 'Space', value: 'space.css' }
];

document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.getElementById('dropdown');

  // Добавление тега <link>, если его нет
  let themeLink = document.getElementById("theme-link");
  if (!themeLink) {
    themeLink = document.createElement("link");
    themeLink.id = "theme-link";
    themeLink.rel = "stylesheet";
    document.head.appendChild(themeLink);
  }

  themes.forEach(optionData => {
    const option = document.createElement('option');
    option.value = optionData.value;
    option.textContent = optionData.text;
    dropdown.appendChild(option);
  });

  // Если тема не задана сохраняем основную
  let themInStorage = localStorage.getItem('theme');

  if (themInStorage === null) {
    themInStorage = 'light.css';
  }

  // Применяем полученную тему
  themeLink.href = '/css/themes/' + themInStorage;
  localStorage.setItem('theme', themInStorage);

  dropdown.selectedIndex = themes.findIndex(theme => theme.value === themInStorage);

  dropdown.addEventListener('change', function() {
    const theme = dropdown.options[dropdown.selectedIndex].value;
    themeLink.href = '/css/themes/' + theme;

    // Сохранение темы в локальное хранилище
    localStorage.setItem('theme', theme);
  });
})
