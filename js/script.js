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

  document.querySelectorAll('.gallery-wrap').forEach(wrap => {
    const gallery = wrap.querySelector('.gallery');
    const prevBtn = wrap.querySelector('.gallery-btn.prev');
    const nextBtn = wrap.querySelector('.gallery-btn.next');

    Array.from(gallery.children).forEach(item => {
      gallery.appendChild(item.cloneNode(true));
    });

    function getScrollAmount() {
      const item = gallery.querySelector('figure') || gallery.querySelector('img');
      const gap = parseFloat(getComputedStyle(gallery).columnGap) || 0;
      const itemWidth = item.getBoundingClientRect().width + gap;
      const visibleItems = Math.round(gallery.clientWidth / itemWidth) || 1;
      return itemWidth * visibleItems;
    }

    function handleScrollSettle() {
      const halfWidth = gallery.scrollWidth / 2;
      if (gallery.scrollLeft >= halfWidth) {
        gallery.scrollLeft -= halfWidth;
      }
    }

    if ('onscrollend' in window) {
      gallery.addEventListener('scrollend', handleScrollSettle);
    } else {
      let scrollSettleTimer;
      gallery.addEventListener('scroll', () => {
        clearTimeout(scrollSettleTimer);
        scrollSettleTimer = setTimeout(handleScrollSettle, 150);
      });
    }

    nextBtn.addEventListener('click', () => {
      gallery.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      const halfWidth = gallery.scrollWidth / 2;
      if (gallery.scrollLeft < getScrollAmount()) {
        gallery.scrollLeft += halfWidth;
      }
      gallery.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
  });

  const noDateCheckbox = document.getElementById('no-date');
const dateFrom = document.getElementById('date-from');
const dateTo = document.getElementById('date-to');

function formatDateInput(input) {
  input.addEventListener('input', () => {
    // Alles außer Ziffern entfernen
    let digits = input.value.replace(/\D/g, '').slice(0, 8);

    let value = digits;

    if (digits.length > 4) {
      value =
        digits.slice(0, 2) + '/' +
        digits.slice(2, 4) + '/' +
        digits.slice(4);
    } else if (digits.length > 2) {
      value =
        digits.slice(0, 2) + '/' +
        digits.slice(2);
    }

    input.value = value;
  });
}

formatDateInput(dateFrom);
formatDateInput(dateTo);

noDateCheckbox.addEventListener('change', () => {
  const disabled = noDateCheckbox.checked;

  dateFrom.disabled = disabled;
  dateTo.disabled = disabled;

  if (disabled) {
    dateFrom.value = '';
    dateTo.value = '';
  }
});