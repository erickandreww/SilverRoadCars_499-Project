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