export function initPayment() {
  const accountButton =
    document.querySelector(".payment__account");

  const copyStatus =
    document.querySelector("#copyStatus");

  if (!accountButton || !copyStatus) {
    return;
  }

  accountButton.addEventListener(
    "click",
    async () => {
      const account =
        accountButton.dataset.account;

      try {
        await navigator.clipboard.writeText(
          account
        );

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
    }
  );
}