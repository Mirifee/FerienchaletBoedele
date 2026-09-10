const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');

  if (slides.length && dots.length) {
    let current = 0;
    let timer;

    const showSlide = (index) => {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    };

    const nextSlide = () => showSlide((current + 1) % slides.length);

    const startTimer = () => {
      timer = setInterval(nextSlide, 20000);
    };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(timer);
        showSlide(i);
        startTimer();
      });
    });

    startTimer();
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

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

if (noDateCheckbox && dateFrom && dateTo) {

const isEnglish = document.documentElement.lang === 'en';

const contactText = isEnglish ? {
  dateInvalid: 'Please enter a valid date in the format DD/MM/YYYY, or select "No date selected yet".',
  dateRange: '"To" cannot be earlier than "From".',
  nameRequired: 'Please enter your name.',
  emailRequired: 'Please enter your email address.',
  sending: 'Sending...',
  success: 'Thank you! Your inquiry has been sent successfully.',
  error: 'Unfortunately, something went wrong while sending. Please try again or email us directly at susannefeichtinger3@gmail.com.',
} : {
  dateInvalid: 'Bitte geben Sie ein gültiges Datum im Format TT/MM/JJJJ ein, oder wählen Sie "Noch kein Datum ausgewählt".',
  dateRange: '"Bis" darf nicht vor "Von" liegen.',
  nameRequired: 'Bitte geben Sie Ihren Namen ein.',
  emailRequired: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
  sending: 'Wird gesendet...',
  success: 'Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet.',
  error: 'Leider ist beim Senden ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an susannefeichtinger3@gmail.com.',
};

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

const dateError = document.getElementById('date-error');

function parseDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  // new Date() rechnet ungültige Werte wie 31.02. auf den nächsten
  // gültigen Tag um -> per Rückvergleich echte Kalenderdaten erzwingen
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

function showDateError(message) {
  dateError.textContent = message;
  dateError.hidden = false;
}

function hideDateError() {
  dateError.textContent = '';
  dateError.hidden = true;
}

function validateDates() {
  hideDateError();

  if (noDateCheckbox.checked) return true;

  const fromValue = dateFrom.value.trim();
  const toValue = dateTo.value.trim();

  if (!fromValue && !toValue) return true;

  const from = parseDate(fromValue);
  const to = parseDate(toValue);

  if (!from || !to) {
    showDateError(contactText.dateInvalid);
    return false;
  }

  if (from > to) {
    showDateError(contactText.dateRange);
    return false;
  }

  return true;
}

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const nameInput = contactForm.querySelector('[name="name"]');
const emailInput = contactForm.querySelector('[name="email"]');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');

function showFieldError(input, errorEl, message) {
  input.classList.add('field-invalid');
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function hideFieldError(input, errorEl) {
  input.classList.remove('field-invalid');
  errorEl.textContent = '';
  errorEl.hidden = true;
}

function validateRequiredField(input, errorEl, message) {
  if (!input.value.trim()) {
    showFieldError(input, errorEl, message);
    return false;
  }

  hideFieldError(input, errorEl);
  return true;
}

nameInput.addEventListener('input', () => hideFieldError(nameInput, nameError));
emailInput.addEventListener('input', () => hideFieldError(emailInput, emailError));

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  formStatus.hidden = true;
  formStatus.classList.remove('success', 'error');

  const nameValid = validateRequiredField(nameInput, nameError, contactText.nameRequired);
  const emailValid = validateRequiredField(emailInput, emailError, contactText.emailRequired);

  if (!nameValid) {
    nameInput.focus();
    return;
  }

  if (!emailValid) {
    emailInput.focus();
    return;
  }

  if (!validateDates()) {
    dateFrom.focus();
    return;
  }

  if (!contactForm.reportValidity()) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = contactText.sending;

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) throw new Error('Serverfehler');

    formStatus.textContent = contactText.success;
    formStatus.classList.add('success');
    contactForm.reset();
    dateFrom.disabled = false;
    dateTo.disabled = false;
  } catch (error) {
    formStatus.textContent = contactText.error;
    formStatus.classList.add('error');
  } finally {
    formStatus.hidden = false;
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

}