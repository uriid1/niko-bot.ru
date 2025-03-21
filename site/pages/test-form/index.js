document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("testForm")
  const successMessage = document.getElementById("successMessage")
  const usernameInput = document.getElementById("username")
  const messageInput = document.getElementById("message")

  /**
   * Скрывает сообщение об успешной отправке
   */
  function hideSuccessMessage() {
    successMessage.style.display = "none"
  }

  /**
   * Обработчик отправки формы
   * @param {Event} event - Событие отправки формы
   */
  async function handleSubmit(event) {
    // Отменяем стандартную отправку формы
    event.preventDefault()

    // Собираем данные в объект
    const formData = {
      username: usernameInput.value,
      message: messageInput.value,
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        successMessage.style.display = "inline"
      } else {
        console.error("Ошибка при отправке формы:", response.statusText)
      }
    } catch (err) {
      console.error("Ошибка:", err)
    }
  }

  // Добавляем обработчики событий
  form.addEventListener("submit", handleSubmit)
  usernameInput.addEventListener("input", hideSuccessMessage)
  messageInput.addEventListener("input", hideSuccessMessage)
})

