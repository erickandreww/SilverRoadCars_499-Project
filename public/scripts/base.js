//Nav Menu

const hamButton = document.querySelector("#menu");
const navigation = document.querySelector("ul");
const span = document.querySelector("#top");

hamButton.addEventListener("click", () => {
  navigation.classList.toggle("open");
  hamButton.classList.toggle("open");
  span.classList.toggle("open");

});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 600) {
    navigation.classList.remove("open");
    hamButton.classList.remove("open");
    span.classList.remove("open");
  }
});

//Carousel 

const slides = document.querySelectorAll(".slide");
let current = 0;

function showSlide(index) {
  slides[current].classList.remove("active");

  current = index;

  if (current >= slides.length) current = 0;
  if (current < 0) current = slides.length - 1;

  slides[current].classList.add("active");
}

document.getElementById("next").addEventListener("click", () => {
  showSlide(current - 1);
});

document.getElementById("prev").addEventListener("click", () => {
  showSlide(current - 1);
});

setInterval(() => {
  showSlide(current + 1);
}, 7000);