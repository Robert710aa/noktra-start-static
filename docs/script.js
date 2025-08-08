/* Noktra Airdrop behaviour (PL only) */



function setLanguage() {}`);
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

  const successMessage = "Zgłoszenie przyjęte. Dziękujemy!";
  const duplicateMessage = "Ten adres już złożył zgłoszenie.";
  const emptyMessage = "Wprowadź adres Solana.";

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
      setMessage(duplicateMessage, '#ff0000');
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
      setMessage(emptyMessage, '#ff0000');
      return;
    }
    if (hasSubmitted(address)) {
      setMessage(duplicateMessage, '#ff0000');
      return;
    }

    markSubmitted(address);
    renderCounter();
    setMessage(successMessage, '#00a8b5');
    form.reset();
    updateState();
  });
});