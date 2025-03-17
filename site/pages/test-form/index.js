document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('testForm');
  const successMessage = document.getElementById('successMessage');
  const usernameInput = document.getElementById('username');
  const messageInput = document.getElementById('message');

  // Отправка формы через AJAX
  form.addEventListener('submit', async (event) => {
    // Отменяем стандартную отправку формы
    event.preventDefault();

    const formData = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        successMessage.style.display = 'inline';
      } else {
        console.error('Ошибка при отправке формы');
      }
    } 
    catch (err) {
      console.error('Ошибка сети:', err);
    }
  });

  // Если пользователь меняет данные в инпутах, скрыть сообщение 
  function hideSuccessMessage() {
    successMessage.style.display = 'none';
  }

  usernameInput.addEventListener('input', hideSuccessMessage);
  messageInput.addEventListener('input', hideSuccessMessage);
});
