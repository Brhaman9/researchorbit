const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

const serviceCarousel = document.querySelector("[data-service-carousel]");
const serviceTrack = document.querySelector("[data-service-track]");

if (serviceCarousel && serviceTrack) {
  const slides = Array.from(serviceTrack.children);
  let activeIndex = 0;

  const updateCarousel = () => {
    serviceTrack.style.transform = `translateX(-${activeIndex * 100}%)`;
  };

  let intervalId = window.setInterval(() => {
    activeIndex = (activeIndex + 1) % slides.length;
    updateCarousel();
  }, 3000);

  serviceCarousel.addEventListener("mouseenter", () => {
    window.clearInterval(intervalId);
  });

  serviceCarousel.addEventListener("mouseleave", () => {
    intervalId = window.setInterval(() => {
      activeIndex = (activeIndex + 1) % slides.length;
      updateCarousel();
    }, 3000);
  });

  window.addEventListener("resize", updateCarousel);
  updateCarousel();
}

const feedbackForm = document.querySelector("[data-feedback-form]");
const feedbackList = document.querySelector("[data-feedback-list]");

if (feedbackForm && feedbackList) {
  const feedbackStorageKey = "researchorbit-feedback";
  const seedFeedback = [
    {
      name: "Dr. Nxxxx rxx.",
      role: "MD Resident, SGRR",
      message:
        "The support was structured, timely, and genuinely helpful throughout the research process.",
    },
    {
      name: "Dr. Axxxxx Sxxxxx.",
      role: "MS Orthopaedics, Rohilkhand Medical University",
      message:
        "I appreciated the clear communication, polished guidance, and the academic professionalism of the team.",
    },
    {
      name: "Dr. Mxxx Axxx",
      role: "Postgraduate Scholar, KGMU Lucknow",
      message:
        "The feedback and manuscript support made my work more organized and much easier to move forward with.",
    },
  ];

  const readFeedback = () => {
    try {
      const stored = window.localStorage.getItem(feedbackStorageKey);
      const parsed = stored ? JSON.parse(stored) : [];
      return [...parsed, ...seedFeedback];
    } catch {
      return [...seedFeedback];
    }
  };

  const saveFeedback = (items) => {
    const userItems = items.filter((item) => !seedFeedback.some((seed) => seed.name === item.name && seed.role === item.role && seed.message === item.message));
    window.localStorage.setItem(feedbackStorageKey, JSON.stringify(userItems));
  };

  const createFeedbackCard = (item) => {
    const card = document.createElement("article");
    card.className = "feedback-card reveal is-visible";

    const message = document.createElement("p");
    message.textContent = `"${item.message}"`;

    const name = document.createElement("strong");
    name.textContent = item.name;

    const role = document.createElement("span");
    role.textContent = item.role;

    card.append(message, name, role);
    return card;
  };

  const renderFeedback = (items) => {
    feedbackList.innerHTML = "";
    items.forEach((item) => {
      feedbackList.appendChild(createFeedbackCard(item));
    });
  };

  let feedbackItems = readFeedback();
  renderFeedback(feedbackItems);

  feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(feedbackForm);
    const name = String(formData.get("name") || "").trim();
    const role = String(formData.get("role") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !role || !message) {
      return;
    }

    const newFeedback = { name, role, message };
    feedbackItems = [newFeedback, ...feedbackItems];
    saveFeedback(feedbackItems);
    renderFeedback(feedbackItems);
    feedbackForm.reset();
  });
}
