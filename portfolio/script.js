const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
const toast = document.getElementById("toast");
const formFeedback = document.getElementById("formFeedback");
const skillNote = document.getElementById("skillNote");

let toastTimer;

function showToast(message) {
  if (!toast) {
    return;
  }


  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}



function closeMenu() {
  if (!navLinks || !menuToggle) {
    return;
  }

  navLinks.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}


function setupMenuToggle() {
  if (!navLinks || !menuToggle) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}


function scrollToTarget(targetSelector) {
  const target = document.querySelector(targetSelector);

  if (!target) {
    return;
  }

  
target.scrollIntoView()
}


function setupSmoothScroll() {
  const scrollButtons = document.querySelectorAll("[data-scroll-target]");
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetSelector = button.getAttribute("data-scroll-target");

      if (targetSelector) {
        scrollToTarget(targetSelector);
      }
    });
  });

  navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetSelector = anchor.getAttribute("href");

      if (!targetSelector || targetSelector === "#") {
        return;
      }

      event.preventDefault();
      scrollToTarget(targetSelector);
      closeMenu();
    });
  });
}

function setupActiveNav() {
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navAnchors.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const currentId = entry.target.getAttribute("id");

        navAnchors.forEach((anchor) => {
          anchor.classList.toggle("active", anchor.getAttribute("href") === `#${currentId}`);
        });
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-20% 0px -30% 0px"
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupRevealOnScroll() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!revealItems.length) {
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function setupSkillInteractions() {
  const skills = document.querySelectorAll(".skill");

  skills.forEach((skill) => {
    const updateSkillNote = () => {
      const note = skill.getAttribute("data-skill-note");

      skills.forEach((item) => item.classList.remove("is-selected"));
      skill.classList.add("is-selected");

      if (skillNote && note) {
        skillNote.textContent = note;
      }
    };

    skill.addEventListener("mouseenter", updateSkillNote);
    skill.addEventListener("focus", updateSkillNote);
    skill.addEventListener("click", updateSkillNote);
  });
}

function setupProjectButtons() {
  const projectButtons = document.querySelectorAll(".project-button");

  projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const projectName = button.getAttribute("data-project") || "This project";
      showToast(`${projectName} is ready for a live link or GitHub URL.`);
    });
  });
}

function validateContactForm(formData) {
  const firstName = formData.get("firstName")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!firstName || !email || !message) {
    return "Please fill in your first name, email address, and message.";
  }

  if (!email.includes("@") || !email.includes(".")) {
    return "Please enter a valid email address.";
  }

  if (message.length < 12) {
    return "Your message should be a little longer so I know what you need.";
  }

  return "";
}

function setFeedback(message, isSuccess) {
  if (!formFeedback) {
    return;
  }

  formFeedback.textContent = message;
  formFeedback.classList.toggle("is-success", isSuccess);
  formFeedback.classList.toggle("is-error", !isSuccess);
}

function setupContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) {
    return;
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const errorMessage = validateContactForm(formData);

    if (errorMessage) {
      setFeedback(errorMessage, false);
      showToast("Please complete the form correctly.");
      return;
    }

    setFeedback("Thanks for reaching out. Your message is ready to send.", true);
    showToast("Message details look great.");
    contactForm.reset();
  });
}

function initPortfolio() {
  setupMenuToggle();
  setupSmoothScroll();
  setupActiveNav();
  setupRevealOnScroll();
  setupSkillInteractions();
  setupProjectButtons();
  setupContactForm();
}

document.addEventListener("DOMContentLoaded", initPortfolio);




