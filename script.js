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

  // Copy token address functionality
  const copyBtn = document.getElementById('copy-token');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const address = copyBtn.getAttribute('data-address');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(address).then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        }).catch(err => {
          console.warn('Failed to copy to clipboard:', err);
          // Fallback for clipboard API failure
          fallbackCopy(address);
        });
      } else {
        // Fallback for older browsers
        fallbackCopy(address);
      }
    });
  }

  // Fallback copy function
  function fallbackCopy(text) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
      copyBtn.textContent = 'Failed to copy';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    }
  }

  // Console log for debugging
  console.log('Noktra Airdrop script loaded successfully');
  
  // Debug NFT images
  const nftImages = document.querySelectorAll('.nft-card img');
  nftImages.forEach((img, index) => {
    console.log(`NFT ${index + 1}:`, img.src);
    img.addEventListener('load', () => {
      console.log(`NFT ${index + 1} loaded successfully`);
    });
    img.addEventListener('error', () => {
      console.error(`NFT ${index + 1} failed to load:`, img.src);
      // Use logo.png as fallback for any failed images
      img.src = 'logo.png';
    });
  });
});