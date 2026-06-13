// Nav Menu
const hamButton = document.querySelector("#menu");
const navigation = document.querySelector("ul");
const span = document.querySelector("#top");
const actBtn = document.querySelector("#c-link");

if (hamButton) {
  hamButton.addEventListener("click", () => {
    if (navigation) navigation.classList.toggle("open");
    hamButton.classList.toggle("open");
    if (span) span.classList.toggle("open");
    if (actBtn) actBtn.classList.toggle("open");
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth >= 600) {
    if (navigation) navigation.classList.remove("open");
    if (hamButton) hamButton.classList.remove("open");
    if (span) span.classList.remove("open");
    if (actBtn) actBtn.classList.remove("open");
  }
});

// Carousel
const slides = document.querySelectorAll(".slide");
if (slides.length > 0) {
  let current = 0;

  function showSlide(index) {
    slides[current].classList.remove("active");
    current = index;
    if (current >= slides.length) current = 0;
    if (current < 0) current = slides.length - 1;
    slides[current].classList.add("active");
  }

  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");
  if (nextBtn) nextBtn.addEventListener("click", () => showSlide(current + 1));
  if (prevBtn) prevBtn.addEventListener("click", () => showSlide(current - 1));

  setInterval(() => showSlide(current + 1), 7000);
}

// Current year / last modified
const yearEl = document.querySelector('#current-year');
const lastModEl = document.querySelector('#last-mod');
if (yearEl) yearEl.textContent = new Date().getFullYear();
if (lastModEl) lastModEl.textContent = document.lastModified;
