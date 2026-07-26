const toggle = document.querySelector("[data-nav-toggle]");
const menu = document.querySelector("[data-nav-menu]");
const yearTargets = document.querySelectorAll("[data-year]");
const scopeCard = document.querySelector("[data-scope-card]");
const scopeButtons = document.querySelectorAll("[data-scope-button]");

yearTargets.forEach((target) => {
  target.textContent = new Date().getFullYear();
});

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (scopeCard && scopeButtons.length) {
  scopeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const scope = button.dataset.scopeButton;

      scopeCard.classList.remove("is-waveform", "is-histogram", "is-vectorscope");
      scopeCard.classList.add(`is-${scope}`);

      scopeButtons.forEach((target) => {
        const isActive = target === button;
        target.classList.toggle("active", isActive);
        target.setAttribute("aria-pressed", String(isActive));
      });
    });
  });
}
