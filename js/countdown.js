import { EVENT_DATE } from "./config.js";

export function initCountdown() {
  const eventDate = new Date(EVENT_DATE);

  const els = {
    days: document.querySelector(
      '[data-time="days"]'
    ),

    hours: document.querySelector(
      '[data-time="hours"]'
    ),

    minutes: document.querySelector(
      '[data-time="minutes"]'
    ),

    seconds: document.querySelector(
      '[data-time="seconds"]'
    )
  };

  if (
    !els.days ||
    !els.hours ||
    !els.minutes ||
    !els.seconds
  ) {
    return;
  }

  const pad = (value) =>
    String(value).padStart(2, "0");

  function updateCountdown() {
    const diff =
      eventDate.getTime() - Date.now();

    if (diff <= 0) {
      els.days.textContent = "00";
      els.hours.textContent = "00";
      els.minutes.textContent = "00";
      els.seconds.textContent = "00";

      return;
    }

    const totalSeconds =
      Math.floor(diff / 1000);

    const days =
      Math.floor(totalSeconds / 86400);

    const hours =
      Math.floor(
        (totalSeconds % 86400) / 3600
      );

    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );

    const seconds =
      totalSeconds % 60;

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
  }

  updateCountdown();

  setInterval(updateCountdown, 1000);
}