// smooth scroll for anchor links on landing page
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// fade in elements as they scroll into view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".feature-card, .stat, .cta").forEach((el) => {
  el.classList.add("scroll-fade");
  observer.observe(el);
});
