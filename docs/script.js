/*
 * Client-side behaviour for the Noktra Airdrop page
 * - Language switching (EN/PL)
 * - One-submission-per-address using localStorage
 *   • Live validation blocks duplicate address
 *   • Persists both in a list and per-address key for robustness
 */

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-en]').forEach((el) => {
    const translation = el.getAttribute(`data-${lang}`);
    if (translation) {
      el.textContent = translation;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('airdrop-form');
  const messageEl = document.getElementById('message');
  const addressField = document.getElementById('address');
  const submitBtn = form ? form.querySelector('button[type="submit"], input[type="submit"]') : null;

  if (!form || !messageEl || !addressField) {
    return;
  }

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

  const normalize = (v) => (v || '').trim().toLowerCase();
  const keyFor = (addr) => `airdrop_submitted:${addr}`;

  function getList() {
    try { return JSON.parse(localStorage.getItem('submittedAddresses') || '[]'); } catch { return []; }
  }
  function setList(list) {
    try { localStorage.setItem('submittedAddresses', JSON.stringify(list)); } catch {}
  }
  function hasSubmitted(addr) {
    try {
      if (localStorage.getItem(keyFor(addr))) return true;
      const list = getList();
      return list.includes(addr);
    } catch {
      return false;
    }
  }
  function markSubmitted(addr) {
    try {
      localStorage.setItem(keyFor(addr), String(Date.now()));
      const list = getList();
      if (!list.includes(addr)) {
        list.push(addr);
        setList(list);
      }
    } catch {}
  }
  function setMessage(text, color) {
    messageEl.textContent = text || '';
    if (color) messageEl.style.color = color;
  }
  function updateState() {
    const address = normalize(addressField.value);
    const dup = address && hasSubmitted(address);
    if (submitBtn) submitBtn.disabled = !!dup;
    if (dup) {
      setMessage(duplicateMessages[currentLang] || duplicateMessages.en, '#ff0000');
    } else if (
      messageEl.textContent === duplicateMessages.en ||
      messageEl.textContent === duplicateMessages.pl
    ) {
      setMessage('', '');
    }
  }

  addressField.addEventListener('input', updateState);
  updateState();
  // Local submission counter (per browser)
  const counterId = 'airdrop-counter';
  function ensureCounter() {
    let counter = document.getElementById(counterId);
    if (!counter) {
      counter = document.createElement('p');
      counter.id = counterId;
      counter.style.marginTop = '8px';
      counter.style.color = '#cccccc';
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitBtn) {
        submitBtn.insertAdjacentElement('afterend', counter);
      } else if (messageEl) {
        messageEl.insertAdjacentElement('afterend', counter);
      } else {
        form.appendChild(counter);
      }
    }
    return counter;
  }
  function getSubmissionCount() {
    try {
      const list = JSON.parse(localStorage.getItem('submittedAddresses') || '[]');
      return Array.isArray(list) ? list.length : 0;
    } catch {
      return 0;
    }
  }
  function renderCounter() {
    const counter = ensureCounter();
    const num = getSubmissionCount();
    counter.textContent = `Liczba zgłoszeń (lokalnie): ${num}`;
  }
  renderCounter();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const address = normalize(addressField.value);

    if (!address) {
      setMessage(emptyMessages[currentLang] || emptyMessages.en, '#ff0000');
      return;
    }
    if (hasSubmitted(address)) {
      setMessage(duplicateMessages[currentLang] || duplicateMessages.en, '#ff0000');
      return;
    }

    markSubmitted(address);
    renderCounter();
    setMessage(successMessages[currentLang] || successMessages.en, '#00a8b5');
    form.reset();
    updateState();
  });
});