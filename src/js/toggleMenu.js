const burgerOverlay = document.getElementsByClassName("burger-overlay");
const burgerBackground = document.getElementsByClassName("burger-background");

function toggleMenu() {
  // Черный фон
  burgerOverlay[0].style.display = "flex";
  // Сама менюшка
  burgerBackground[0].style.display = "flex";

  // Отключение скрола
  const body = document.body;
  body.classList.toggle('no-scroll');
}

function closeMenu() {
  // Черный фон
  burgerOverlay[0].style.display = "none";
  // Сама менюшка
  burgerBackground[0].style.display = "none";

  // Включение скрола скрола
  const body = document.body;
  body.classList.toggle('no-scroll');
}

// Закрытие меню при изменении размера окна
window.addEventListener("resize", function () {
  if (window.innerWidth > 500) {
    document.querySelector(".links").classList.remove("active");
  }
});
