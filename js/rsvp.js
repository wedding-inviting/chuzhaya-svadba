import {
  takeRole,
  loadRoles
} from "./roles.js";

export function initRSVP() {
  const form =
    document.querySelector("#rsvpForm");

  const payment =
    document.querySelector("#payment");

  const error =
    document.querySelector("#formError");

  if (!form || !payment || !error) {
    return;
  }

  form.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const button =
        form.querySelector(
          "button[type='submit']"
        );

      const originalButtonHTML =
        button.innerHTML;

      button.disabled = true;

      button.innerHTML = `
        Отправляем… <span>♡</span>
      `;

      error.hidden = true;

      try {
        const roleSelect =
          form.querySelector(
            'select[name="role"]'
          );

        const role =
          roleSelect.value;

        // Проверяем и занимаем роль
        const roleTaken =
          await takeRole(role);

        if (!roleTaken) {
          error.textContent =
            "Эта роль уже занята. Пожалуйста, выбери другую ♡";

          error.hidden = false;

          button.disabled = false;

          button.innerHTML =
            originalButtonHTML;

          await loadRoles();

          return;
        }

        // Создаём данные формы
        const formData =
          new FormData(form);

        // Отправляем в Formspree красивое название роли
        const selectedRole =
          roleSelect.options[
            roleSelect.selectedIndex
          ].text;

        formData.set(
          "role",
          selectedRole
        );

        const response =
          await fetch(form.action, {
            method: "POST",
            body: formData,
            headers: {
              Accept:
                "application/json"
            }
          });

        if (!response.ok) {
          throw new Error(
            "Form submission failed"
          );
        }

        // Форма отправлена
        form.reset();

        form.hidden = true;

        payment.hidden = false;

        payment.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      } catch (submissionError) {
        console.error(
          submissionError
        );

        error.textContent =
          "Не получилось отправить заявку. Попробуй ещё раз.";

        error.hidden = false;

        button.disabled = false;

        button.innerHTML =
          originalButtonHTML;
      }
    }
  );
}