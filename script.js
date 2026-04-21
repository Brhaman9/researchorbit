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
