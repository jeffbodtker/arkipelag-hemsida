// Arkipelag Kyl & Energi — shared site behaviour

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Menu drawer -------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const menuDrawer = document.getElementById('menuDrawer');
  const menuClose = document.getElementById('menuClose');
  const menuOverlay = document.getElementById('menuOverlay');

  if (navToggle && menuDrawer && menuOverlay) {
    const openMenu = () => {
      menuDrawer.classList.add('is-open');
      menuOverlay.classList.add('is-open');
      menuDrawer.setAttribute('aria-hidden', 'false');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      menuClose?.focus();
    };
    const closeMenu = () => {
      menuDrawer.classList.remove('is-open');
      menuOverlay.classList.remove('is-open');
      menuDrawer.setAttribute('aria-hidden', 'true');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navToggle.focus();
    };

    navToggle.addEventListener('click', openMenu);
    menuClose?.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuDrawer.classList.contains('is-open')) closeMenu();
    });
    menuDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Accordion sections inside the drawer
    menuDrawer.querySelectorAll('.menu-accordion__trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const accordion = trigger.closest('.menu-accordion');
        const isOpen = accordion.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      });
    });
  }
});
