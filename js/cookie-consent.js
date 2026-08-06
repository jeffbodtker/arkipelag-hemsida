// Arkipelag Kyl & Energi — cookie-samtycke (GDPR)
//
// Google Analytics och Meta Pixel är inte inkopplade ännu. När ni har
// mät-ID:n, klistra in de riktiga script-taggarna i loadAnalytics()
// respektive loadMarketing() nedan. De körs bara om besökaren har
// godkänt statistik/marknadsföring — aldrig innan samtycke givits.

const CONSENT_KEY = 'arkipelag_cookie_consent';

function getConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveConsent(analytics, marketing) {
  const consent = { analytics, marketing, savedAt: new Date().toISOString() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch (e) {
    // localStorage otillgängligt (t.ex. privat läge) — samtycke frågas igen nästa besök.
  }
  applyConsent(consent);
}

function applyConsent(consent) {
  if (consent.analytics) loadAnalytics();
  if (consent.marketing) loadMarketing();
}

function loadAnalytics() {
  // TODO: Klistra in Google Analytics (GA4) här när mät-ID finns, t.ex.:
  // const s = document.createElement('script');
  // s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
  // s.async = true;
  // document.head.appendChild(s);
  // window.dataLayer = window.dataLayer || [];
  // function gtag(){ dataLayer.push(arguments); }
  // gtag('js', new Date());
  // gtag('config', 'G-XXXXXXX');
}

function loadMarketing() {
  // TODO: Klistra in Meta Pixel-kod här när pixel-ID finns.
}

function buildBanner() {
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.id = 'cookieBanner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie-inställningar');
  banner.innerHTML = `
    <p>Vi använder cookies för att analysera trafik och förbättra sajten. Läs mer i vår <a href="integritetspolicy.html">integritetspolicy</a>.</p>
    <div class="cookie-banner__actions">
      <button type="button" class="btn btn--outline btn--sm" id="cookieDecline">Endast nödvändiga</button>
      <button type="button" class="btn btn--primary btn--sm" id="cookieAccept">Acceptera alla</button>
    </div>
  `;
  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add('is-visible'));

  banner.querySelector('#cookieAccept').addEventListener('click', () => {
    saveConsent(true, true);
    hideBanner(banner);
  });
  banner.querySelector('#cookieDecline').addEventListener('click', () => {
    saveConsent(false, false);
    hideBanner(banner);
  });

  return banner;
}

function hideBanner(banner) {
  banner.classList.remove('is-visible');
  setTimeout(() => banner.remove(), 300);
}

function addFooterLink() {
  const footerBottom = document.querySelector('.footer-bottom');
  if (!footerBottom || document.getElementById('cookieSettingsLink')) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'cookieSettingsLink';
  btn.className = 'footer-cookie-link';
  btn.textContent = 'Cookie-inställningar';
  btn.addEventListener('click', () => {
    if (document.getElementById('cookieBanner')) return;
    buildBanner();
  });
  footerBottom.appendChild(btn);
}

document.addEventListener('DOMContentLoaded', () => {
  addFooterLink();
  const consent = getConsent();
  if (consent) {
    applyConsent(consent);
  } else {
    buildBanner();
  }
});
