// Arkipelag Kyl & Energi — animerad värmepumpsjämförelse (privat.html)

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('vp-jamforelse');
  if (!section) return;

  const chips = Array.from(section.querySelectorAll('.vp-chip'));
  const cards = Array.from(section.querySelectorAll('.vp-kort'));
  const llCard = section.querySelector('[data-card="ll"]');
  const lvCard = section.querySelector('[data-card="lv"]');

  function applyChoice(choice) {
    chips.forEach((chip) => chip.classList.toggle('is-active', chip.dataset.choice === choice));

    if (choice === 'el') {
      llCard.classList.add('rek');
      lvCard.classList.remove('rek');
      llCard.classList.remove('dimmad');
      lvCard.classList.add('dimmad');
    } else if (choice === 'vatten') {
      lvCard.classList.add('rek');
      llCard.classList.remove('rek');
      lvCard.classList.remove('dimmad');
      llCard.classList.add('dimmad');
    } else {
      cards.forEach((card) => card.classList.remove('rek', 'dimmad'));
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => applyChoice(chip.dataset.choice));
  });

  applyChoice('el');

  // Entrance animation once the section scrolls into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('syns'), i * 120);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(section);
  } else {
    cards.forEach((card) => card.classList.add('syns'));
  }

  // 3D tilt + cursor spotlight on hover (skipped for touch / reduced-motion users)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (!prefersReducedMotion && !isCoarsePointer) {
    cards.forEach((card) => {
      const inner = card.querySelector('.vp-3d');
      const glans = card.querySelector('.vp-glans');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = x / rect.width;
        const py = y / rect.height;
        const tiltX = (py - 0.5) * -6;
        const tiltY = (px - 0.5) * 6;
        inner.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        if (glans) {
          glans.style.setProperty('--gx', `${px * 100}%`);
          glans.style.setProperty('--gy', `${py * 100}%`);
        }
      });
      card.addEventListener('mouseleave', () => {
        inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
      });
    });
  }
});
