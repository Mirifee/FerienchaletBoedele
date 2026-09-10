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

    // Inhalt einmal duplizieren, damit am Ende/Anfang eine optisch identische
    // Kopie anschließt und der Reset dorthin unsichtbar ist
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
      // 'instant' statt 'smooth', damit der Reset nicht animiert (und damit
      // sichtbar) wird - das CSS scroll-behavior:smooth würde ihn sonst
      // trotzdem gleiten lassen
      if (gallery.scrollLeft >= halfWidth) {
        gallery.scrollTo({ left: gallery.scrollLeft - halfWidth, behavior: 'instant' });
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

      // Nahe am Anfang: unsichtbar in die zweite Kopie vorspringen, bevor
      // smooth zurückgescrollt wird - sonst würde am linken Rand blockiert
      if (gallery.scrollLeft < getScrollAmount()) {
        gallery.scrollTo({ left: gallery.scrollLeft + halfWidth, behavior: 'instant' });

        // Einen Frame warten, bis der Instant-Sprung wirklich übernommen
        // wurde, bevor der smooth Scroll startet - sonst rechnet der Browser
        // den smooth Scroll noch von der alten Position aus
        requestAnimationFrame(() => {
          gallery.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });
      } else {
        gallery.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      }
    });
  });

  const noDateCheckbox = document.getElementById('no-date');
const dateFrom = document.getElementById('date-from');
const dateTo = document.getElementById('date-to');

function formatDateInput(input) {
  const segmentLengths = [2, 2, 4]; // Tag, Monat, Jahr

  input.addEventListener('input', () => {
    const segments = [''];
    let segIndex = 0;

    for (const char of input.value) {
      if (/\d/.test(char)) {
        // Segment voll (z. B. Tag hat schon 2 Ziffern) -> ins nächste Segment springen
        if (segments[segIndex].length >= segmentLengths[segIndex]) {
          if (segIndex < segmentLengths.length - 1) {
            segIndex++;
            segments[segIndex] = '';
          } else {
            continue; // Jahr ist voll, überzählige Ziffern ignorieren
          }
        }
        segments[segIndex] += char;
      } else if (char === '.' || char === '/') {
        // Punkt oder Slash schließt das aktuelle Segment ab, auch wenn es
        // noch nicht voll ist (z. B. "7" -> "07")
        if (segIndex < segmentLengths.length - 1 && segments[segIndex].length > 0) {
          segIndex++;
          segments[segIndex] = '';
        }
      }
    }

    // Abgeschlossene Tag-/Monat-Segmente mit nur einer Ziffer mit führender Null auffüllen
    for (let i = 0; i < segIndex; i++) {
      if (i < 2 && segments[i].length === 1) {
        segments[i] = '0' + segments[i];
      }
    }

    input.value = segments.slice(0, segIndex + 1).join('/');
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