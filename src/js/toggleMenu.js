const burgerOverlay = document.getElementsByClassName('burger-overlay')[0];
const burgerBackground = document.getElementsByClassName('burger-background')[0];

function openMenu() {
  // Черный фон
  burgerOverlay.classList.add('show');
  burgerOverlay.classList.remove("hiding");
  // Сама менюшка
  burgerBackground.classList.add('show');
  burgerBackground.classList.remove("hiding");

  // Отключение скрола
  const body = document.body;
  body.classList.toggle('no-scroll');
}

function closeMenu() {
  // Черный фон
  burgerOverlay.classList.add("hiding");
  // Сама менюшка
  burgerBackground.classList.add("hiding");

  // Завершение анимации перед скрытием
  setTimeout(() => {
    burgerBackground.classList.remove('show');
    burgerOverlay.classList.remove('show');
  }, 200)

  // Включение скрола скрола
  const body = document.body;
  body.classList.toggle('no-scroll');
}

// Закрытие меню при изменении размера окна
window.addEventListener('resize', function () {
  if (window.innerWidth > 500) {
    burgerBackground.classList.remove('show');
    burgerOverlay.classList.remove('show');
  }
});
