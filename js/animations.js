export function initAnimations() {
  const revealElements =
    document.querySelectorAll(
      ".reveal, .reveal-card"
    );

  if (!revealElements.length) {
    return;
  }

  const revealObserver =
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "is-visible"
          );

          revealObserver.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.15,
        rootMargin:
          "0px 0px -50px 0px"
      }
    );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}