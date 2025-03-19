document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('testForm');
  const successMessage = document.getElementById('successMessage');
  const usernameInput = document.getElementById('username');
  const messageInput = document.getElementById('message');

  // Отправка формы через AJAX
  form.addEventListener('submit', async (event) => {
    // Отменяем стандартную отправку формы
    event.preventDefault();

    // Собираем данные в объект
    const formData = {
      username: usernameInput.value,
      message: messageInput.value
    };

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        successMessage.style.display = 'inline';
      } else {
        console.error(response);
      }
    } 
    catch (err) {
      console.error('Error:', err);
    }
  });

  // Если пользователь меняет данные в инпутах, скрыть сообщение 
  function hideSuccessMessage() {
    successMessage.style.display = 'none';
  }

  usernameInput.addEventListener('input', hideSuccessMessage);
  messageInput.addEventListener('input', hideSuccessMessage);
});
