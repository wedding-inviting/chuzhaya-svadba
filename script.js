(() => {
  const eventDate = new Date("2026-10-31T16:30:00+03:00");

  const els = {
    days: document.querySelector('[data-time="days"]'),
    hours: document.querySelector('[data-time="hours"]'),
    minutes: document.querySelector('[data-time="minutes"]'),
    seconds: document.querySelector('[data-time="seconds"]')
  };

  const pad = (value) => String(value).padStart(2, "0");

  function updateCountdown() {
    const diff = eventDate.getTime() - Date.now();

    if (diff <= 0) {
      els.days.textContent = "00";
      els.hours.textContent = "00";
      els.minutes.textContent = "00";
      els.seconds.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  const form = document.querySelector("#rsvpForm");
const payment = document.querySelector("#payment");
const error = document.querySelector("#formError");

form?.addEventListener("submit", async (event) => {
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
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    form.reset();

    // Скрываем форму
    form.hidden = true;

    // Показываем оплату
    payment.hidden = false;

    // Прокручиваем к блоку оплаты
    payment.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  } catch (submissionError) {
    console.error(submissionError);

    error.hidden = false;

    button.disabled = false;
    button.innerHTML = originalButtonHTML;
  }
});

const accountButton = document.querySelector(
  ".payment__account"
);

const copyStatus = document.querySelector(
  "#copyStatus"
);

accountButton?.addEventListener("click", async () => {
  const account = accountButton.dataset.account;

  try {
    await navigator.clipboard.writeText(account);

    copyStatus.textContent =
      "Номер счёта скопирован ♡";

    accountButton.classList.add(
      "payment__account--copied"
    );

    setTimeout(() => {
      copyStatus.textContent =
        "Нажми на номер, чтобы скопировать";

      accountButton.classList.remove(
        "payment__account--copied"
      );
    }, 2500);

  } catch {
    copyStatus.textContent =
      "Скопируй номер счёта вручную";
  }
});

  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-card"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");

        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
})();
