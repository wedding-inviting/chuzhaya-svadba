import {
  takeRole,
  loadRoles
} from "./roles.js";

export function initRSVP() {
  const form = document.querySelector("#rsvpForm");
  const payment = document.querySelector("#payment");
  const error = document.querySelector("#formError");

  if (!form || !payment || !error) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = form.querySelector(
      "button[type='submit']"
    );

    const originalButtonHTML = button.innerHTML;

    button.disabled = true;
    button.innerHTML = `
      Отправляем… <span>♡</span>
    `;

    error.hidden = true;

    try {
      console.log("1. Форма отправлена");

      const roleSelect = form.querySelector(
        'select[name="role"]'
      );

      if (!roleSelect) {
        throw new Error("Не найден select роли");
      }

      const role = roleSelect.value;

      console.log("2. Выбранная роль:", role);

      // Проверяем и занимаем роль
      const roleTaken = await takeRole(role);

      console.log("3. Ответ Supabase:", roleTaken);

      if (!roleTaken) {
        error.textContent =
          "Эта роль уже занята. Пожалуйста, выбери другую ♡";

        error.hidden = false;

        button.disabled = false;
        button.innerHTML = originalButtonHTML;

        await loadRoles();

        return;
      }

      // Создаём данные формы
      const formData = new FormData(form);

      // Получаем красивое название роли
      const selectedRole =
        roleSelect.options[
          roleSelect.selectedIndex
        ].text;

      formData.set("role", selectedRole);

      console.log(
        "4. Отправляем данные в Formspree"
      );

      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      console.log(
        "5. Formspree status:",
        response.status
      );

      const responseText = await response.text();

      console.log(
        "6. Formspree response:",
        responseText
      );

      if (!response.ok) {
        throw new Error(
          `Formspree error ${response.status}: ${responseText}`
        );
      }

      console.log(
        "7. Заявка успешно отправлена"
      );

      form.reset();

      form.hidden = true;
      payment.hidden = false;

      payment.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    } catch (submissionError) {
      console.error(
        "ОШИБКА ОТПРАВКИ:",
        submissionError
      );

      error.textContent =
        `Ошибка: ${submissionError.message}`;

      error.hidden = false;

      button.disabled = false;
      button.innerHTML = originalButtonHTML;
    }
  });
}