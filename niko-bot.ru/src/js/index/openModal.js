// Функция для открытия модального окна с изображением
function openModal(img) {
  const modal = document.getElementById("screenshotModal");
  const modalImg = document.getElementById("modalImage");
  const span = document.getElementById("closeModal");
  const body = document.body;

  body.classList.toggle('no-scroll');

  modal.style.display = "flex";
  modalImg.src = img.src; 

  // Закрытие модального окна при клике на крестик
  span.onclick = function() {
    modal.style.display = "none";
    body.classList.toggle('no-scroll');
  }

  // Закрытие модального окна при клике вне изображения
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      body.classList.toggle('no-scroll');
    }
  }
}

document.body.addEventListener("click", function(event) {
  if (event.target.classList.contains("screenshot")) {
    openModal(event.target);
  }
})
