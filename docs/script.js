/* Noktra Airdrop Script - Version 23 */
/* Fixed NFT display - using 3 local PNG files - removed duplicate styles */

/* Noktra Airdrop behaviour (PL only) */

// Translation messages
const duplicateMessages = {
  en: "This address has already submitted an application.",
  pl: "Ten adres już złożył zgłoszenie."
};

// Language switching functionality
function setLanguage(lang) {
  const elements = document.querySelectorAll('[data-' + lang + ']');
  elements.forEach(el => {
    const translation = el.getAttribute('data-' + lang);
    if (translation) {
      el.textContent = translation;
    }
  });
}

// Image error handling
function handleImageError(img) {
  img.style.display = 'none';
  const parent = img.parentElement;
  if (parent) {
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'Image not available';
    errorMsg.style.color = '#ff6b6b';
    errorMsg.style.fontSize = '0.9rem';
    parent.appendChild(errorMsg);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Handle image loading errors
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', () => handleImageError(img));
  });

  const form = document.getElementById('airdrop-form');
  const messageEl = document.getElementById('message');
  const addressField = document.getElementById('address');
  const submitBtn = form ? form.querySelector('button[type="submit"], input[type="submit"]') : null;

  if (!form || !messageEl || !addressField) {
    console.warn('Required form elements not found');
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

  function ensureCounter() {
    let counter = document.getElementById('airdrop-counter');
    if (!counter) {
      counter = document.createElement('div');
      counter.id = 'airdrop-counter';
      counter.style.cssText = 'text-align: center; margin: 1rem 0; color: #00ffcc; font-size: 0.9rem;';
      form.parentNode.insertBefore(counter, form.nextSibling);
    }
    return counter;
  }

  function getSubmissionCount() {
    try {
      return getList().length;
    } catch {
      return 0;
    }
  }

  function renderCounter() {
    const counter = ensureCounter();
    const count = getSubmissionCount();
    counter.textContent = `Liczba zgłoszeń: ${count}`;
  }

  // Copy token address functionality
  const copyBtn = document.getElementById('copy-token');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const address = copyBtn.getAttribute('data-address');
      if (!address) return;

      try {
        await navigator.clipboard.writeText(address);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        fallbackCopy(address);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }
    });
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
  }

  // Form submission handling
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const address = normalize(addressField.value);
    if (!address) {
      setMessage(emptyMessage, '#ff0000');
      return;
    }

    if (hasSubmitted(address)) {
      setMessage(duplicateMessage, '#ff0000');
      return;
    }

    // Simulate form submission
    setMessage('Przetwarzanie...', '#00ffcc');
    
    setTimeout(() => {
      markSubmitted(address);
      setMessage(successMessage, '#00ff00');
      form.reset();
      renderCounter();
      
      // Reset message after 5 seconds
      setTimeout(() => {
        if (messageEl.textContent === successMessage) {
          setMessage('', '');
        }
      }, 5000);
    }, 1000);
  });

  // Real-time validation
  addressField.addEventListener('input', updateState);
  addressField.addEventListener('blur', updateState);

  // Initial state
  updateState();
  renderCounter();
});