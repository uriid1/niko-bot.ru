/**
 * Открывает модальное окно с изображением
 * @param {HTMLImageElement} img - Изображение для отображения в модальном окне
 */
function openModal(img) {
  const modal = document.getElementById("screenshotModal")
  const modalImg = document.getElementById("modalImage")
  const span = document.getElementById("closeModal")
  const body = document.body

  // Отключаем прокрутку страницы
  body.classList.add("no-scroll")

  // Устанавливаем изображение и показываем модальное окно
  modal.style.display = "flex"
  modalImg.src = img.src
  modalImg.alt = img.alt || "Увеличенное изображение"

  // Закрытие модального окна при клике на крестик
  span.onclick = () => {
    modal.style.display = "none"
    body.classList.remove("no-scroll")
  }

  // Закрытие модального окна при клике вне изображения
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none"
      body.classList.remove("no-scroll")
    }
  }
}

// Добавляем обработчик для всех изображений с классом screenshot
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("screenshot")) {
      openModal(event.target)
    }
  })
})

// Экспортируем функцию для использования в HTML
window.openModal = openModal

