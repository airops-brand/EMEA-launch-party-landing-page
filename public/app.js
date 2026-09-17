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
const why = document.querySelector('.why');
if (why && window.gsap && window.ScrollTrigger) {
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
}

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
