export function initVisitorsHomePage() {
  const carousel = document.querySelector("#testimonialCarousel");
  const prevButton = document.querySelector(".custom-prev");
  const nextButton = document.querySelector(".custom-next");

  prevButton.addEventListener("click", function (event) {
    event.preventDefault();

    const activeSlide = carousel.querySelector(".carousel-item.active");
    let prevSlide = activeSlide.previousElementSibling;

    if (!prevSlide) {
      prevSlide = carousel.querySelector(".carousel-item:last-child");
    }

    activeSlide.classList.remove("active");
    prevSlide.classList.add("active");
  });

  nextButton.addEventListener("click", function (event) {
    event.preventDefault();

    const activeSlide = carousel.querySelector(".carousel-item.active");
    let nextSlide = activeSlide.nextElementSibling;

    if (!nextSlide) {
      nextSlide = carousel.querySelector(".carousel-item:first-child");
    }

    activeSlide.classList.remove("active");
    nextSlide.classList.add("active");
  });
}
