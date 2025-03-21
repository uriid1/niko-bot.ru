// Получаем элементы один раз при загрузке скрипта
const burgerOverlay = document.querySelector(".burger-overlay")
const burgerPanel = document.querySelector(".burger-menu__panel")
const body = document.body

/**
 * Открывает мобильное меню
 */
function openMenu() {
  // Черный фон
  burgerOverlay.classList.add("show")
  burgerOverlay.classList.remove("hiding")

  // Сама менюшка
  burgerPanel.classList.add("show")
  burgerPanel.classList.remove("hiding")

  // Отключение скрола
  body.classList.add("no-scroll")
}

/**
 * Закрывает мобильное меню
 */
function closeMenu() {
  // Черный фон
  burgerOverlay.classList.add("hiding")
  // Сама менюшка
  burgerPanel.classList.add("hiding")

  // Завершение анимации перед скрытием
  setTimeout(() => {
    burgerPanel.classList.remove("show")
    burgerOverlay.classList.remove("show")
  }, 200)

  // Включение скрола
  body.classList.remove("no-scroll")
}

// Закрытие меню при изменении размера окна
window.addEventListener("resize", () => {
  if (window.innerWidth > 500) {
    burgerPanel.classList.remove("show")
    burgerOverlay.classList.remove("show")
    body.classList.remove("no-scroll")
  }
})

// Экспортируем функции для использования в HTML
window.openMenu = openMenu
window.closeMenu = closeMenu

