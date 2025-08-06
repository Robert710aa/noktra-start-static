/*
 * Client-side behaviour for the Noktra Airdrop page
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
 * 'data-en' and 'data-pl' attributes in order to be updated.
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

    // Provide localized feedback messages. This does not actually submit
    // data to a server. Two categories are defined: success when a new
    // address is submitted and error messages for duplicate or empty
    // submissions.
    const successMessages = {
      en: 'Thank you for submitting! Stay tuned for the airdrop.',
      pl: 'Dziękujemy za zgłoszenie! Oczekuj na airdrop.'
    };
    const duplicateMessages = {
      en: 'This address has already claimed the airdrop.',
      pl: 'Ten adres już odebrał airdrop.'
    };
    const emptyMessages = {
      en: 'Please enter a Solana address.',
      pl: 'Wprowadź adres Solana.'
    };

    // Read the address input and normalise it to lower case. The
    // address field may be missing; handle that safely.
    const addressField = document.getElementById('address');
    const address = addressField ? addressField.value.trim().toLowerCase() : '';

    // Retrieve the list of previously submitted addresses from localStorage.
    const storedAddresses = JSON.parse(localStorage.getItem('submittedAddresses') || '[]');

    // If no address was provided, inform the user and do nothing.
    if (!address) {
      messageEl.style.color = '#ff0000';
      messageEl.textContent = emptyMessages[currentLang] || emptyMessages.en;
      return;
    }

    // If the address has already been submitted, show an error and stop.
    if (storedAddresses.includes(address)) {
      messageEl.style.color = '#ff0000';
      messageEl.textContent = duplicateMessages[currentLang] || duplicateMessages.en;
      return;
    }

    // At this point we have a non-empty address that hasn’t been seen
    // before. Persist it to localStorage so subsequent submissions will
    // recognise it as a duplicate. Then provide success feedback.
    storedAddresses.push(address);
    localStorage.setItem('submittedAddresses', JSON.stringify(storedAddresses));

    messageEl.style.color = '#00a8b5';
    messageEl.textContent = successMessages[currentLang] || successMessages.en;

    // Reset the form fields only after persisting the address. This clears
    // the inputs but the saved address remains in localStorage. The user
    // must enter a new address for the next submission.
    form.reset();
  });
});