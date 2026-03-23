document.addEventListener("DOMContentLoaded", () => {
  const dataLayerName = window.dataLayer = window.dataLayer || [];

  function pushEvent(eventName, params = {}) {
    dataLayerName.push({
      event: eventName,
      ...params
    });
    console.log("Event pushed:", eventName, params);
  }

  let variant = localStorage.getItem("ab_variant");

  if (!variant) {
    variant = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem("ab_variant", variant);
  }

  const ctaMain = document.getElementById("cta-main");
  const ctaSecondary = document.getElementById("cta-secondary");

  if (ctaMain) {
    ctaMain.textContent = variant === "A" ? "Wypróbuj za darmo" : "Zacznij teraz";
  }

  if (ctaSecondary) {
    ctaSecondary.textContent = variant === "A" ? "Wypróbuj za darmo" : "Zacznij teraz";
  }

  pushEvent("ab_impression", { variant });


  const ctaButtons = document.querySelectorAll(".btn, #cta-main, #cta-secondary");

  ctaButtons.forEach((button) => {
    button.addEventListener("click", () => {
      pushEvent("cta_click", {
        variant,
        button_id: button.id || "no-id",
        button_text: button.textContent.trim()
      });
    });
  });


  const navPricing = document.getElementById("nav-pricing");
  if (navPricing) {
    navPricing.addEventListener("click", () => {
      pushEvent("nav_pricing_click", { variant });
    });
  }


  const signupForm = document.getElementById("signup-form");
  const successMessage = document.getElementById("success-message");
  const errorMessage = document.getElementById("error-message");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email")?.value.trim() || "";
      const role = document.getElementById("role")?.value.trim() || "";
      const goal = document.getElementById("goal")?.value.trim() || "";

      if (!email || !role) {
        if (errorMessage) {
          errorMessage.style.display = "block";
          errorMessage.textContent = "Uzupełnij wymagane pola: email i rola.";
        }
        if (successMessage) successMessage.style.display = "none";
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        if (errorMessage) {
          errorMessage.style.display = "block";
          errorMessage.textContent = "Podaj poprawny adres email.";
        }
        if (successMessage) successMessage.style.display = "none";
        return;
      }

      pushEvent("form_submit", {
        variant,
        role: role,
        has_goal: goal ? "yes" : "no"
      });

      if (errorMessage) errorMessage.style.display = "none";

      if (successMessage) {
        successMessage.style.display = "block";
        successMessage.textContent = "Dziękujemy! Formularz został wysłany 🎉";
      }

      signupForm.reset();
    });
  }


  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.parentElement;
      item.classList.toggle("active");
    });
  });

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

 
  const isPricingPage = window.location.pathname.toLowerCase().includes("pricing.html");
  if (isPricingPage) {
    pushEvent("pricing_view", { variant });
  }


  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, {
      threshold: 0.15
    });

    revealElements.forEach((element) => revealObserver.observe(element));
  }
});