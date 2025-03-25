document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form')
  const successMessage = document.getElementById('successMessage')
  const nameInput = document.getElementById('name')
  const telegramInput = document.getElementById('telegram')
  const messageInput = document.getElementById('message')

  /**
   * Скрывает сообщение об успешной отправке
   */
  function hideSuccessMessage() {
    successMessage.style.display = 'none'
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
      name: nameInput.value,
      telegram: telegramInput.value,
      message: messageInput.value,
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log(response);

      if (response.ok) {
        successMessage.style.display = 'block'
      } else {
        console.error('Ошибка при отправке формы:', response.statusText)
      }
    } catch (err) {
      console.error('Ошибка:', err)
    }
  }

  // Добавляем обработчики событий
  form.addEventListener('submit', handleSubmit)
  nameInput.addEventListener('input', hideSuccessMessage)
  telegramInput.addEventListener('input', hideSuccessMessage)
  messageInput.addEventListener('input', hideSuccessMessage)
})
