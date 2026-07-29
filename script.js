const toggle = document.querySelector("[data-nav-toggle]");
const menu = document.querySelector("[data-nav-menu]");
const yearTargets = document.querySelectorAll("[data-year]");
const scopeCard = document.querySelector("[data-scope-card]");
const scopeButtons = document.querySelectorAll("[data-scope-button]");
const heroTypewriter = document.querySelector("[data-hero-typewriter]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  document.documentElement.classList.add("motion-ready");
}

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

if (heroTypewriter) {
  const words = ["Shoot.", "Grade.", "Create."];

  if (prefersReducedMotion) {
    heroTypewriter.textContent = "Shoot. Grade. Create.";
  } else {
    let wordIndex = 0;
    let letterIndex = words[0].length;
    let deleting = true;

    const typeNextFrame = () => {
      const word = words[wordIndex];
      heroTypewriter.textContent = word.slice(0, letterIndex);

      if (!deleting && letterIndex === word.length) {
        deleting = true;
        window.setTimeout(typeNextFrame, 1500);
        return;
      }

      if (deleting && letterIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        window.setTimeout(typeNextFrame, 320);
        return;
      }

      letterIndex += deleting ? -1 : 1;
      window.setTimeout(typeNextFrame, deleting ? 82 : 135);
    };

    window.setTimeout(typeNextFrame, 1250);
  }
}

if (!prefersReducedMotion) {
  const observedAnimations = document.querySelectorAll(".capture-stage, .workflow-grid");

  if ("IntersectionObserver" in window) {
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          animationObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    observedAnimations.forEach((target) => {
      animationObserver.observe(target);
    });
  } else {
    observedAnimations.forEach((target) => {
      target.classList.add("is-visible");
    });
  }

  document.querySelectorAll("[data-spin-ring]").forEach((host) => {
    const ring = host.querySelector(".button-ring");

    if (!ring || typeof ring.animate !== "function" || typeof DOMMatrixReadOnly !== "function") {
      return;
    }

    let playing = [];

    const currentAngle = () => {
      const transform = window.getComputedStyle(ring).transform;

      if (!transform || transform === "none") {
        return 0;
      }

      try {
        const matrix = new DOMMatrixReadOnly(transform);
        return (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;
      } catch (error) {
        return 0;
      }
    };

    const spin = (keyframes, options) => {
      const animation = ring.animate(keyframes, options);
      playing.push(animation);
      return animation;
    };

    // Read the live angle first, then drop the old animations so the new one
    // picks up exactly where the ring is instead of snapping back to zero.
    const takeOver = () => {
      const angle = currentAngle();
      playing.forEach((animation) => animation.cancel());
      playing = [];
      return angle;
    };

    const spinUp = () => {
      const from = takeOver();

      const whip = spin(
        [{ transform: `rotate(${from}deg)` }, { transform: `rotate(${from + 540}deg)` }],
        { duration: 620, easing: "cubic-bezier(0.08, 0.82, 0.16, 1)", fill: "forwards" }
      );

      whip.finished.then(
        () => {
          if (!playing.includes(whip)) {
            return;
          }

          spin(
            [{ transform: `rotate(${from + 540}deg)` }, { transform: `rotate(${from + 900}deg)` }],
            { duration: 6000, easing: "linear", iterations: Infinity }
          );
        },
        () => {}
      );
    };

    const spinDown = () => {
      const from = takeOver();

      spin(
        [{ transform: `rotate(${from}deg)` }, { transform: `rotate(${from + 32}deg)` }],
        { duration: 900, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" }
      );
    };

    host.addEventListener("pointerenter", spinUp);
    host.addEventListener("pointerleave", spinDown);
    host.addEventListener("pointercancel", spinDown);
    host.addEventListener("focus", spinUp);
    host.addEventListener("blur", spinDown);
  });

  const finalSection = document.querySelector(".final-section");
  const finalImage = document.querySelector(".final-image img");
  let parallaxFrame = null;

  const updateFinalParallax = () => {
    parallaxFrame = null;

    if (!finalSection || !finalImage) {
      return;
    }

    const rect = finalSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)));
    const offset = (progress - 0.5) * -34;

    finalImage.style.setProperty("--final-parallax", `${offset.toFixed(2)}px`);
  };

  const requestFinalParallax = () => {
    if (parallaxFrame !== null) {
      return;
    }

    parallaxFrame = window.requestAnimationFrame(updateFinalParallax);
  };

  updateFinalParallax();
  window.addEventListener("scroll", requestFinalParallax, { passive: true });
  window.addEventListener("resize", requestFinalParallax);
}
