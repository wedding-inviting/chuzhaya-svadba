import {
  registerGuest,
  loadRoles
} from "./roles.js";

export function initRSVP() {
  const form = document.querySelector("#rsvpForm");
  const payment = document.querySelector("#payment");
  const error = document.querySelector("#formError");

  if (!form || !payment || !error) {
    return;
  }

  const validatePhone = initPhoneMask();

  form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validatePhone()) {
    return;
  }

  const button = form.querySelector("button[type='submit']");
  const originalButtonHTML = button.innerHTML;

  button.disabled = true;
  button.innerHTML = `Отправляем… <span>♡</span>`;
  error.hidden = true;

  try {
    const roleSelect = form.querySelector('select[name="role"]');

    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
    const role = roleSelect.value;

    // Сохраняем заявку в Supabase и занимаем роль
    const registered = await registerGuest({
      name,
      phone,
      roleSlug: role,
      message
    });

    if (!registered) {
      error.textContent =
        "Эта роль уже занята. Пожалуйста, выбери другую ♡";
      error.hidden = false;

      button.disabled = false;
      button.innerHTML = originalButtonHTML;

      await loadRoles();
      return;
    }

    // Подготавливаем данные для Formspree
    const formData = new FormData(form);

    const selectedRole =
      roleSelect.options[roleSelect.selectedIndex].text;

    formData.set("role", selectedRole);

    // Отправляем заявку на почту
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      const responseText = await response.text();

      throw new Error(
        `Formspree error ${response.status}: ${responseText}`
      );
    }

    // Показываем оплату после успешной отправки
    form.reset();
    form.hidden = true;
    payment.hidden = false;

    payment.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  } catch (submissionError) {
    console.error("Ошибка отправки заявки:", submissionError);

    error.textContent =
      "Не получилось отправить заявку. Попробуй ещё раз.";
    error.hidden = false;

    button.disabled = false;
    button.innerHTML = originalButtonHTML;
  }
});
}

function initPhoneMask() {
  const phoneInput = document.querySelector("#phone");
  const phoneError = document.querySelector("#phoneError");

  if (!phoneInput) return;

  phoneInput.addEventListener("keydown", (event) => {
    if (event.key !== "Backspace") return;

    const cursorPosition = phoneInput.selectionStart;

    // Если курсор стоит сразу после пробела —
    // удаляем пробел и предыдущую цифру
    if (
      cursorPosition > 0 &&
      phoneInput.value[cursorPosition - 1] === " "
    ) {
      event.preventDefault();

      const value = phoneInput.value;

      phoneInput.value =
        value.slice(0, cursorPosition - 2) +
        value.slice(cursorPosition);

      phoneInput.setSelectionRange(
        cursorPosition - 2,
        cursorPosition - 2
      );

      validatePhone();
    }
  });

  phoneInput.addEventListener("input", () => {
    let value = phoneInput.value.replace(/\D/g, "");

    if (value.startsWith("8")) {
      value = "7" + value.slice(1);
    }

    if (value.startsWith("9")) {
      value = "7" + value;
    }

    value = value.slice(0, 11);

    let formatted = "";

    if (value.length > 0) {
      formatted = "+7";
    }

    if (value.length > 1) {
      formatted += " " + value.slice(1, 4);
    }

    if (value.length > 4) {
      formatted += " " + value.slice(4, 7);
    }

    if (value.length > 7) {
      formatted += " " + value.slice(7, 9);
    }

    if (value.length > 9) {
      formatted += " " + value.slice(9, 11);
    }

    phoneInput.value = formatted;

    validatePhone();
  });

  phoneInput.addEventListener("blur", validatePhone);

  function validatePhone() {
    const phone = phoneInput.value.trim();

    const phoneRegex = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;

    if (!phone) {
      phoneInput.classList.remove("is-valid");
      phoneInput.classList.add("is-error");
      phoneError.hidden = false;

      return false;
    }

    if (!phoneRegex.test(phone)) {
      phoneInput.classList.remove("is-valid");
      phoneInput.classList.add("is-error");
      phoneError.hidden = false;

      return false;
    }

    phoneInput.classList.remove("is-error");
    phoneInput.classList.add("is-valid");
    phoneError.hidden = true;

    return true;
  }

  return validatePhone;
}