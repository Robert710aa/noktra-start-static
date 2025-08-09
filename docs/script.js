/* Noktra Airdrop Script - Version 27 */
/* Fixed NFT display - using 3 local PNG files - removed duplicate styles */
/* Added copy notification and enhanced functionality */

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

// Copy notification functionality
function showCopyNotification() {
  const notification = document.getElementById('copyNotification');
  if (notification) {
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
}

// Enhanced copy to clipboard function
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showCopyNotification();
    console.log('Address copied successfully');
  } catch (err) {
    console.error('Failed to copy: ', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showCopyNotification();
  }
}

// Visit counter functionality
function updateVisitCounter() {
  let visits = localStorage.getItem('noktraVisits') || 0;
  visits = parseInt(visits) + 1;
  localStorage.setItem('noktraVisits', visits);
  
  const counterElement = document.getElementById('visitCounter');
  if (counterElement) {
    counterElement.textContent = visits;
  }
}

// Confetti effect function
function createConfetti() {
  const colors = ['#00ffcc', '#00ccff', '#ff6b6b', '#ffd93d', '#6bcf7f'];
  const confettiCount = 100;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '50%';
    
    document.body.appendChild(confetti);
    
    const animation = confetti.animate([
      { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
      { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
      duration: Math.random() * 3000 + 2000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    animation.onfinish = () => {
      document.body.removeChild(confetti);
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Set initial language
  setLanguage('pl');
  
  // Update visit counter
  updateVisitCounter();
  
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
    copyBtn.addEventListener('click', () => {
      const address = copyBtn.getAttribute('data-address');
      copyToClipboard(address);
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
      updateState();
      createConfetti(); // Trigger confetti effect on successful submission
    }, 1000);
  });

  // Real-time validation
  addressField.addEventListener('input', updateState);
  addressField.addEventListener('blur', updateState);

  // Initial state
  updateState();
  renderCounter();
});