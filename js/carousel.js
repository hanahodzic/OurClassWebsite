
let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.carousel .slide');
const totalSlides = slides.length;

function showSlide(index) {

  if (index >= totalSlides) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = totalSlides - 1;
  } else {
    currentSlide = index;
  }
 
  const carousel = document.querySelector('.carousel-images');
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

  updateDots();
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function createDots() {
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.addEventListener('click', () => showSlide(i));
    dotsContainer.appendChild(dot);
  }
  
  document.querySelector('.carousel').appendChild(dotsContainer);
  updateDots();
}

function updateDots() {
  const dots = document.querySelectorAll('.carousel-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function initCarousel() {
  if (slides.length === 0) return;
  
  createDots();

  slideInterval = setInterval(nextSlide, 5000);

  const carousel = document.querySelector('.carousel');
  carousel.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  
  carousel.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
  });
  
  showSlide(0);
}

document.addEventListener('DOMContentLoaded', initCarousel);