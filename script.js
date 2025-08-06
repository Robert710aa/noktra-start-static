/*
 * Client‑side behaviour for the Noktra Airdrop page
 *
 * This script handles language switching between English and Polish and
 * provides basic feedback when the airdrop form is submitted. It
 * leverages data attributes on elements to swap the displayed text
 * depending on the chosen language.
 */

/* Keep track of the current language; default is English */
let currentLang = 'en';

/**
 * Switch the displayed language of all elements that define
 * translations via data attributes. Elements must declare both
 * `data-en` and `data-pl` attributes in order to be updated.
 *
 * @param {string} lang - A short language code ('en' or 'pl').
 */
function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-en]').forEach((el) => {
    const translation = el.getAttribute(`data-${lang}`);
    if (translation) {
      el.textContent = translation;
    }
  });
}

/**
 * Initialise event listeners once the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Attach form submission handler
  const form = document.getElementById('airdrop-form');
  const messageEl = document.getElementById('message');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // Provide simple feedback. This does not actually submit data to a server.
    const messages = {
      en: 'Thank you for submitting! Stay tuned for the airdrop.',
      pl: 'Dziękujemy za zgłoszenie! Oczekuj na airdrop.'
    };
    messageEl.style.color = '#00a8b5';
    messageEl.textContent = messages[currentLang] || messages.en;
    // Reset the form fields
    form.reset();
  });
});