// Arkipelag Kyl & Energi — offertwizard (kontakt.html)
//
// OBS: Detta är enbart klientlogik. Formuläret har ingen serverdel ännu —
// koppla `form.addEventListener('submit', ...)` nedan till ett formulär-API
// (t.ex. Web3Forms, Formspree eller ett eget endpoint) innan sidan går live,
// annars försvinner inskickade förfrågningar. Web3Forms/Formspree stödjer
// även filbifogning om "Handlingar"-steget ska fungera på riktigt.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.wizard-step'));
  const totalSteps = steps.length;
  const progressEls = Array.from(document.querySelectorAll('#wizardProgress span'));
  const stepCurrentEl = document.getElementById('stepCurrent');
  const btnBack = document.getElementById('btnBack');
  const btnNext = document.getElementById('btnNext');
  const btnSubmit = document.getElementById('btnSubmit');
  const wizardSuccess = document.getElementById('wizardSuccess');
  const summaryBox = document.getElementById('summaryBox');
  const fileUploadField = document.getElementById('fileUploadField');
  const handlingarJa = document.getElementById('handlingarJa');
  const phoneField = document.getElementById('phone');
  const emailField = document.getElementById('email');
  const contactHint = document.getElementById('contactHint');
  const tidsplanAkut = document.getElementById('tidsplanAkut');
  const akutNotice = document.getElementById('akutNotice');

  let currentStep = 1;

  function getCustomerType() {
    const checked = form.querySelector('input[name="customerType"]:checked');
    return checked ? checked.value : null;
  }

  function applyGroupVisibility() {
    const type = getCustomerType();
    form.querySelectorAll('[data-group-for]').forEach((el) => {
      const matches = el.getAttribute('data-group-for') === type;
      el.hidden = !matches;
      el.querySelectorAll('input, select, textarea').forEach((input) => {
        input.disabled = !matches;
      });
    });
  }

  function showStep(n) {
    steps.forEach((step) => {
      step.classList.toggle('is-active', Number(step.dataset.step) === n);
    });
    progressEls.forEach((span, i) => {
      span.classList.toggle('is-done', i + 1 < n);
      span.classList.toggle('is-active', i + 1 === n);
    });
    stepCurrentEl.textContent = String(n);
    btnBack.disabled = n === 1;
    const isLast = n === totalSteps;
    btnNext.hidden = isLast;
    btnSubmit.hidden = !isLast;
    if (isLast) buildSummary();
  }

  function contactMethodValid() {
    return Boolean((phoneField && phoneField.value.trim()) || (emailField && emailField.value.trim()));
  }

  function validateStep(n) {
    const step = steps.find((s) => Number(s.dataset.step) === n);
    if (!step) return true;
    const fields = Array.from(step.querySelectorAll('input, select, textarea'))
      .filter((el) => !el.disabled && el.closest('[hidden]') === null);
    let valid = true;
    let firstInvalid = null;
    fields.forEach((field) => {
      if (!field.checkValidity()) {
        valid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (n === 6 && valid && !contactMethodValid()) {
      valid = false;
      contactHint.style.color = 'var(--color-danger)';
      firstInvalid = phoneField;
    } else if (contactHint) {
      contactHint.style.color = '';
    }

    if (!valid && firstInvalid) {
      firstInvalid.reportValidity ? firstInvalid.reportValidity() : firstInvalid.focus();
    }
    return valid;
  }

  function labelFor(input) {
    const card = input.closest('.choice-card');
    if (card) return card.querySelector('strong')?.textContent || input.value;
    const select = input.tagName === 'SELECT' ? input : null;
    if (select) return select.options[select.selectedIndex]?.text || select.value;
    return input.value;
  }

  function buildSummary() {
    const type = getCustomerType();
    const rows = [];
    rows.push(['Vem är du?', type === 'foretag' ? 'Företag' : 'Privatperson']);

    const behov = form.querySelector('input[name="behov"]:checked');
    if (behov) rows.push(['Behov', labelFor(behov)]);

    const system = form.querySelector('input[name="system"]:checked');
    if (system) rows.push(['System', labelFor(system)]);

    const tidsplan = form.querySelector('input[name="tidsplan"]:checked');
    if (tidsplan) rows.push(['Tidsplan', labelFor(tidsplan)]);

    const desc = form.querySelector('#description');
    if (desc && desc.value) rows.push(['Beskrivning', desc.value]);

    const handlingar = form.querySelector('input[name="handlingar"]:checked');
    if (handlingar) rows.push(['Handlingar', labelFor(handlingar)]);

    if (type === 'foretag') {
      const company = form.querySelector('#company');
      if (company && company.value) rows.push(['Företag', company.value]);
    }
    const name = form.querySelector('#name');
    if (name && name.value) rows.push(['Kontaktperson', name.value]);
    const phone = form.querySelector('#phone');
    if (phone && phone.value) rows.push(['Telefon', phone.value]);
    const email = form.querySelector('#email');
    if (email && email.value) rows.push(['E-post', email.value]);
    const ort = form.querySelector('#ort');
    if (ort && ort.value) rows.push(['Adress/ort', ort.value]);
    if (type === 'foretag') {
      const orgnr = form.querySelector('#orgnr');
      if (orgnr && orgnr.value) rows.push(['Org.nr', orgnr.value]);
    }

    summaryBox.innerHTML = rows
      .map(([label, value]) => `
        <div style="display:flex; justify-content:space-between; gap: var(--space-4); padding-block: var(--space-2); border-bottom: 1px solid var(--color-border);">
          <span style="color:var(--color-muted); font-size: var(--fs-sm);">${label}</span>
          <span style="font-weight:600; text-align:right;">${value}</span>
        </div>
      `)
      .join('');
  }

  if (handlingarJa && fileUploadField) {
    form.querySelectorAll('input[name="handlingar"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        fileUploadField.hidden = !handlingarJa.checked;
      });
    });
  }

  if (tidsplanAkut && akutNotice) {
    form.querySelectorAll('input[name="tidsplan"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        akutNotice.hidden = !tidsplanAkut.checked;
      });
    });
  }

  btnNext.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    if (currentStep === 1) applyGroupVisibility();
    currentStep = Math.min(currentStep + 1, totalSteps);
    showStep(currentStep);
    form.closest('.form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  btnBack.addEventListener('click', () => {
    currentStep = Math.max(currentStep - 1, 1);
    showStep(currentStep);
  });

  [phoneField, emailField].forEach((field) => {
    field?.addEventListener('input', () => {
      if (contactHint) contactHint.style.color = '';
    });
  });

  const step6 = steps.find((s) => Number(s.dataset.step) === totalSteps);
  step6?.addEventListener('input', () => buildSummary());
  step6?.addEventListener('change', () => buildSummary());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    // TODO: skicka `new FormData(form)` till ett formulär-API här.

    form.querySelectorAll('.wizard-step, .wizard-meta, .wizard-progress, .wizard-nav').forEach((el) => {
      el.style.display = 'none';
    });
    wizardSuccess.classList.add('is-active');
  });

  showStep(currentStep);
});
