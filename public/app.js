// Keep decorative pointer effects separate from the registration interaction.
const hero = document.querySelector('.hero');
const heroPhoto = hero?.querySelector('.hero-photo');
const heroButton = hero?.querySelector('[data-register]');
if (heroPhoto && heroButton) {
  const pointerMotion = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const spotlight = document.createElement('div');
  spotlight.className = 'hero-spotlight';
  spotlight.setAttribute('aria-hidden', 'true');
  const spotlightPhoto = heroPhoto.cloneNode();
  spotlightPhoto.alt = '';
  spotlight.append(spotlightPhoto);
  heroPhoto.after(spotlight);
  let frame = 0;
  let pointer;
  function resetHeroPointer() {
    cancelAnimationFrame(frame);
    frame = 0;
    hero.classList.remove('has-pointer');
    heroButton.style.removeProperty('translate');
  }
  function paintHeroPointer() {
    frame = 0;
    if (!pointerMotion.matches || document.querySelector('dialog[open]')) return resetHeroPointer();
    const rect = hero.getBoundingClientRect();
    spotlight.style.setProperty('--spot-x', `${pointer.x - rect.left}px`);
    spotlight.style.setProperty('--spot-y', `${pointer.y - rect.top}px`);
    hero.classList.add('has-pointer');
    // Layout coordinates stay stable while the button moves toward the pointer.
    const buttonX = rect.left + heroButton.offsetLeft + heroButton.offsetWidth / 2;
    const buttonY = rect.top + heroButton.offsetTop + heroButton.offsetHeight / 2;
    const dx = pointer.x - buttonX;
    const dy = pointer.y - buttonY;
    const nearby = Math.abs(dx) < heroButton.offsetWidth / 2 + 35 && Math.abs(dy) < heroButton.offsetHeight / 2 + 35;
    heroButton.style.translate = nearby ? `${Math.max(-6, Math.min(6, dx * 0.08))}px ${Math.max(-4, Math.min(4, dy * 0.08))}px` : '0px 0px';
  }
  hero.addEventListener('pointermove', event => {
    if (!pointerMotion.matches || event.pointerType === 'touch') return;
    pointer = { x: event.clientX, y: event.clientY };
    if (!frame) frame = requestAnimationFrame(paintHeroPointer);
  });
  hero.addEventListener('pointerleave', resetHeroPointer);
  heroButton.addEventListener('click', resetHeroPointer);
  heroButton.addEventListener('focus', resetHeroPointer);
  pointerMotion.addEventListener('change', resetHeroPointer);
  window.addEventListener('blur', resetHeroPointer);
  window.addEventListener('scroll', resetHeroPointer, { passive: true });
}

const logoMotionToggle = document.querySelector('.logo-motion-toggle');
logoMotionToggle?.addEventListener('click', () => {
  const paused = document.querySelector('.logos').classList.toggle('is-paused');
  logoMotionToggle.setAttribute('aria-pressed', String(paused));
  logoMotionToggle.textContent = paused ? 'Play logo animation' : 'Pause logo animation';
});
const dialog = document.querySelector('#registration');
let opener;
document.querySelectorAll('[data-register]').forEach(button => button.addEventListener('click', () => {
  opener = button;
  dialog.showModal();
  document.body.classList.add('modal-open');
  document.querySelector('#registration-title').focus();
}));
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  opener?.focus();
});
document.querySelectorAll('.why').forEach(why => {
  if (!window.gsap || !window.ScrollTrigger) return;
  const statement = why.querySelector('.why-statement');
  const text = statement.textContent.trim();
  statement.setAttribute('aria-label', text);
  const words = text.split(/\s+/).map(word => {
    const span = document.createElement('span');
    span.className = 'why-word';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = word;
    return span;
  });
  statement.replaceChildren(...words.flatMap((word, index) => index ? [document.createTextNode(' '), word] : [word]));
  gsap.registerPlugin(ScrollTrigger);
  // Match the homepage intro-text timeline: discrete word reveals, 0.8s scrub.
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(words, { opacity: 0.1 }, {
      opacity: 1,
      duration: 0,
      stagger: 0.25,
      ease: 'none',
      scrollTrigger: {
        trigger: why,
        start: 'clamp(top 70%)',
        end: 'clamp(bottom 90%)',
        scrub: 0.8
      }
    });
  });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
});

const registrationForm = document.querySelector('#form-preview');
const registrationStatus = document.querySelector('#form-status');
const registrationFields = ['firstname', 'email', 'company', 'jobtitle', 'hdyhau_event'];
let registrationPending = false;
let registrationComplete = false;
registrationForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (registrationPending || registrationComplete || !registrationForm.reportValidity()) return;
  const config = window.EVENT_CONFIG;
  const values = new FormData(registrationForm);
  const fields = registrationFields.map(name => ({
    objectTypeId: '0-1', name, value: String(values.get(name) || '').trim()
  }));
  if (fields.some(field => !field.value)) {
    registrationStatus.textContent = 'Please complete all fields.';
    return;
  }
  const fieldset = registrationForm.querySelector('fieldset');
  const button = registrationForm.querySelector('[type="submit"]');
  registrationPending = true;
  fieldset.disabled = true;
  registrationForm.setAttribute('aria-busy', 'true');
  registrationStatus.textContent = 'Submitting your registration…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${config.portalId}/${config.formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ fields, context: { pageUri: location.origin + location.pathname, pageName: document.title } })
    });
    if (!response.ok) {
      registrationStatus.textContent = response.status === 429
        ? 'Too many attempts. Please wait a moment and try again.'
        : 'Your registration was not accepted. Please try again or contact the event team.';
      return;
    }
    registrationComplete = true;
    registrationStatus.textContent = 'Thanks for your submission! Our team will get back to you soon.';
    button.textContent = 'Registered';
  } catch {
    registrationStatus.textContent = 'We couldn’t confirm your registration. Please check your connection and try again.';
  } finally {
    clearTimeout(timeout);
    registrationPending = false;
    fieldset.disabled = registrationComplete;
    registrationForm.setAttribute('aria-busy', 'false');
  }
});

const audienceHeading = document.querySelector('.audience-rotator');
if (audienceHeading) {
  const roles = [...audienceHeading.querySelectorAll('.audience-role')];
  const toggle = document.querySelector('.audience-motion-toggle');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const titles = roles.map(role => role.textContent);
  const typed = document.createElement('span');
  typed.className = 'audience-typed';
  typed.setAttribute('aria-hidden', 'true');
  typed.textContent = titles[0].slice(0, 1);
  audienceHeading.append(typed);
  let index = 0;
  let letters = 1;
  let deleting = false;
  let delay = 90;
  let paused = false;
  let timer;
  function scheduleAudience() {
    clearTimeout(timer);
    audienceHeading.classList.toggle('is-typing', !motion.matches);
    if (paused || motion.matches || document.hidden || audienceHeading.matches(':hover')) return;
    timer = setTimeout(() => {
      letters += deleting ? -1 : 1;
      typed.textContent = titles[index].slice(0, letters);
      delay = deleting ? 45 : 90;
      if (!deleting && letters === titles[index].length) {
        deleting = true;
        delay = 1800;
      } else if (deleting && letters === 1) {
        deleting = false;
        index = (index + 1) % titles.length;
        typed.textContent = titles[index].slice(0, 1);
        delay = 350;
      }
      scheduleAudience();
    }, delay);
  }
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Play title animation' : 'Pause title animation';
    scheduleAudience();
  });
  audienceHeading.addEventListener('mouseenter', () => clearTimeout(timer));
  audienceHeading.addEventListener('mouseleave', scheduleAudience);
  document.addEventListener('visibilitychange', scheduleAudience);
  motion.addEventListener('change', scheduleAudience);
  scheduleAudience();
}
