
function normalizeLinkTargets() {
  const sitePages = new Set([
    'index.html',
    'schedule.html',
    'travel.html',
    'rsvp.html',
    'registry.html',
    'gallery.html',
    'faq.html',
    'details.html',
    'Registry.html'
  ]);

  document.querySelectorAll('a[href]').forEach((link) => {
    const rawHref = link.getAttribute('href') || '';
    if (rawHref.startsWith('#')) return;

    const cleanHref = rawHref.split('#')[0].split('?')[0];
    const isInternalPage = sitePages.has(cleanHref) || cleanHref.startsWith('./') || cleanHref.startsWith('/');

    if (isInternalPage) {
      link.removeAttribute('target');
      link.removeAttribute('rel');
    } else if (/^https?:\/\//i.test(rawHref)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

normalizeLinkTargets();

const weddingDate = new Date('2026-10-10T16:30:00-04:00');

function updateCountdown() {
  const el = document.querySelector('[data-countdown]');
  if (!el) return;

  const diff = Math.max(0, weddingDate.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  el.innerHTML = [
    ['days', days],
    ['hours', hours],
    ['minutes', minutes],
    ['seconds', seconds]
  ].map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('');
}

updateCountdown();
setInterval(updateCountdown, 1000);

const navToggle = document.querySelector('[data-nav-toggle]');
const primaryNav = document.querySelector('[data-primary-nav]');
if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const audio = document.querySelector('[data-bg-music]');
const musicButton = document.querySelector('[data-music-toggle]');

async function tryPlayMusic(unmute = false) {
  if (!audio) return false;
  if (unmute) audio.muted = false;
  try {
    await audio.play();
    if (musicButton) musicButton.textContent = audio.muted ? 'Music ready — tap to unmute' : 'Pause song';
    return true;
  } catch (error) {
    if (musicButton) musicButton.textContent = 'Play song';
    return false;
  }
}

if (audio) {
  audio.volume = 0.42;
  tryPlayMusic(false);

  const unlock = () => {
    tryPlayMusic(true);
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
    window.removeEventListener('touchstart', unlock);
  };

  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });
  window.addEventListener('touchstart', unlock, { once: true });
}

if (musicButton && audio) {
  musicButton.addEventListener('click', async (event) => {
    event.stopPropagation();
    if (audio.paused || audio.muted) {
      audio.muted = false;
      await tryPlayMusic(true);
    } else {
      audio.pause();
      musicButton.textContent = 'Play song';
    }
  });
}
