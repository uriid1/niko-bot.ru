function toggleMenu() {
  document.querySelector(".links").classList.toggle("active");

  const body = document.body;
  body.classList.toggle('no-scroll');
}

// Закрытие меню при изменении размера окна
window.addEventListener("resize", function () {
  if (window.innerWidth > 500) {
    document.querySelector(".links").classList.remove("active");
  }
});
