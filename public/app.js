const logoMotionToggle = document.querySelector('.logo-motion-toggle');
logoMotionToggle?.addEventListener('click', () => {
  const paused = document.querySelector('.logos').classList.toggle('is-paused');
  logoMotionToggle.setAttribute('aria-pressed', String(paused));
  logoMotionToggle.textContent = paused ? 'Play logo animation' : 'Pause logo animation';
});
const dialog = document.querySelector('#registration');
const status = document.querySelector('#form-status');
let formStarted = false;
let opener;
function loadRegistration() {
  const config = window.EVENT_CONFIG;
  if (formStarted || !config?.portalId) return;
  formStarted = true;
  status.textContent = 'Loading registration…';
  const frame = document.querySelector('#hubspot-form');
  frame.classList.add('hs-form-frame');
  frame.dataset.region = config.region;
  frame.dataset.formId = config.formId;
  frame.dataset.portalId = config.portalId;
  frame.setAttribute('aria-busy', 'true');
  const fail = () => {
    frame.setAttribute('aria-busy', 'false');
    status.textContent = 'The registration form couldn’t load. Please refresh the page and try again.';
  };
  const timeout = setTimeout(fail, 20000);
  // Register listeners before loading HubSpot so the ready event is never missed.
  window.addEventListener('hs-form-event:on-ready', event => {
    if (event.detail?.formId !== config.formId) return;
    clearTimeout(timeout);
    frame.setAttribute('aria-busy', 'false');
    status.textContent = '';
  });
  window.addEventListener('hs-form-event:on-submission:success', event => {
    if (event.detail?.formId !== config.formId) return;
    status.textContent = 'Thank you — your registration has been received.';
  });
  const script = document.createElement('script');
  script.src = `https://js.hsforms.net/forms/embed/${config.portalId}.js`;
  script.defer = true;
  script.onerror = () => { clearTimeout(timeout); fail(); };
  document.head.append(script);
}
document.querySelectorAll('[data-register]').forEach(button => button.addEventListener('click', () => {
  opener = button;
  dialog.showModal();
  document.body.classList.add('modal-open');
  document.querySelector('#registration-title').focus();
  loadRegistration();
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
