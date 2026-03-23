document.addEventListener("DOMContentLoaded", () => {
  window.dataLayer = window.dataLayer || [];

  function pushEvent(eventName, params = {}) {
    window.dataLayer.push({
      event: eventName,
      ...params
    });
    console.log("Event:", eventName, params);
  }

  /* =========================
     A/B test CTA
  ========================= */
  let variant = localStorage.getItem("ab_variant");

  if (!variant) {
    variant = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem("ab_variant", variant);
  }

  const ctaMain = document.getElementById("cta-main");

  if (ctaMain) {
    ctaMain.textContent = variant === "A" ? "Dołącz za darmo" : "Rozpocznij teraz";
  }

  pushEvent("ab_impression", { variant });

  /* =========================
     CTA click
  ========================= */
  const ctaButtons = document.querySelectorAll(".btn");

  ctaButtons.forEach((button) => {
    button.addEventListener("click", () => {
      pushEvent("cta_click", {
        variant,
        button_id: button.id || "no-id",
        button_text: button.textContent.trim()
      });
    });
  });

  /* =========================
     Pricing nav click
  ========================= */
  const navPricing = document.getElementById("nav-pricing");

  if (navPricing) {
    navPricing.addEventListener("click", () => {
      pushEvent("nav_pricing_click", { variant });
    });
  }

  /* =========================
     Form submit
  ========================= */
  const signupForm = document.getElementById("signup-form");
  const formMessage = document.getElementById("form-message");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const role = document.getElementById("role").value.trim();
      const goal = document.getElementById("goal").value.trim();

      formMessage.textContent = "";
      formMessage.classList.remove("success", "error");

      if (!email || !role) {
        formMessage.textContent = "Uzupełnij wymagane pola: email i rola.";
        formMessage.classList.add("error");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        formMessage.textContent = "Podaj poprawny adres e-mail.";
        formMessage.classList.add("error");
        return;
      }

      pushEvent("form_submit", {
        variant,
        role: role,
        has_goal: goal ? "yes" : "no"
      });

      formMessage.textContent = "Dziękujemy! Formularz został wysłany 🎉";
      formMessage.classList.add("success");

      signupForm.reset();
    });
  }

  /* =========================
     Scroll 75%
  ========================= */
  let scrollTracked = false;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    const scrollPercent = ((scrollTop + windowHeight) / docHeight) * 100;

    if (!scrollTracked && scrollPercent >= 75) {
      scrollTracked = true;
      pushEvent("scroll_75", { variant });
    }
  });

  /* =========================
     Pricing page view
  ========================= */
  const isPricingPage = window.location.pathname.toLowerCase().includes("pricing.html");

  if (isPricingPage) {
    pushEvent("pricing_view", { variant });
  }

  /* =========================
     Reveal animation
  ========================= */
  const revealElements = document.querySelectorAll(
    ".hero, .card, .cta-box, .signup-form, .faq-item"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal", "visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((element) => {
      element.classList.add("reveal");
      observer.observe(element);
    });
  }
});