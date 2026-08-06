// Arkipelag Kyl & Energi — värmepumpsväljare (privat.html)
//
// Intresseanmälan skickas till Netlify Forms (data-netlify="true" på <form>).
// Inskickade anmälningar dyker upp under Forms i Netlify-dashboarden.

document.addEventListener('DOMContentLoaded', () => {
  // ---- Intresseanmälan-modal -----------------------------------------------
  const overlay = document.getElementById('vpModalOverlay');
  const modal = document.getElementById('vpModal');
  const closeBtn = document.getElementById('vpModalClose');
  const doneBtn = document.getElementById('vpModalDone');
  const formWrap = document.getElementById('vpModalForm');
  const successWrap = document.getElementById('vpModalSuccess');
  const form = document.getElementById('vpInterestForm');
  if (!overlay || !modal || !form) return;

  const modalType = document.getElementById('vpModalType');
  const modalTitle = document.getElementById('vpModalTitle');
  const inputType = document.getElementById('vpInterestTypeInput');
  const phoneField = document.getElementById('vpPhone');
  const emailField = document.getElementById('vpEmail');
  const contactHint = document.getElementById('vpContactHint');
  const nameField = document.getElementById('vpName');
  const submitBtn = form.querySelector('button[type="submit"]');

  let lastFocused = null;

  function openModal(button) {
    const type = button.dataset.type || '';

    modalType.textContent = type;
    modalTitle.textContent = `Intresseanmälan — ${type}`;

    formWrap.hidden = false;
    successWrap.hidden = true;
    form.reset();
    inputType.value = type;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Skicka intresseanmälan';

    lastFocused = document.activeElement;
    overlay.hidden = false;
    modal.hidden = false;
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      modal.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';
    nameField?.focus();
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      overlay.hidden = true;
      modal.hidden = true;
    }, 250);
    lastFocused?.focus();
  }

  document.querySelectorAll('.vp-want-btn').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn));
  });

  overlay.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  doneBtn?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  [phoneField, emailField].forEach((field) => {
    field?.addEventListener('input', () => {
      if (contactHint) contactHint.style.color = '';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const hasContact = Boolean(phoneField.value.trim() || emailField.value.trim());
    if (!form.checkValidity() || !hasContact) {
      if (!hasContact && contactHint) contactHint.style.color = 'var(--color-danger)';
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Skickar...';

    fetch('/', { method: 'POST', body: new FormData(form) })
      .then((res) => {
        if (!res.ok) throw new Error('Nätverksfel');
        formWrap.hidden = true;
        successWrap.hidden = false;
      })
      .catch(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Skicka intresseanmälan';
        alert('Något gick fel när anmälan skulle skickas. Ring oss gärna istället på 0708-19 88 18.');
      });
  });
});
