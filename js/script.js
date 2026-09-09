const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');

let current = 0;
let timer;

function showSlide(index) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');

  current = index;

  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

function nextSlide() {
  showSlide((current + 1) % slides.length);
}

function startTimer() {
  timer = setInterval(nextSlide, 20000);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(timer);
    showSlide(i);
    startTimer();
  });
});

startTimer();

const gallery = document.getElementById('picturegallery');
const prevBtn = document.querySelector('.gallery-btn.prev');
const nextBtn = document.querySelector('.gallery-btn.next');

function scrollByImages(direction) {
  const imgWidth = gallery.querySelector('img').getBoundingClientRect().width;
  const gap = 16;

  gallery.scrollBy({
    left: direction * (imgWidth + gap) * 3,
    behavior: 'smooth'
  });
}

prevBtn.addEventListener('click', () => scrollByImages(-1));
nextBtn.addEventListener('click', () => scrollByImages(1));