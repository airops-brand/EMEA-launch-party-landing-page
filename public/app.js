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
  const fail = () => {
    status.textContent = 'The registration form couldn’t load. Please refresh the page and try again.';
  };
  const timeout = setTimeout(fail, 20000);
  const script = document.createElement('script');
  script.src = 'https://js.hsforms.net/forms/embed/v2.js';
  script.async = true;
  script.onerror = () => { clearTimeout(timeout); fail(); };
  script.onload = () => {
    if (!window.hbspt?.forms) { clearTimeout(timeout); fail(); return; }
    window.hbspt.forms.create({
      portalId: config.portalId, formId: config.formId, region: config.region,
      target: '#hubspot-form', css: '', cssClass: 'event-form',
      onFormReady: () => {
        clearTimeout(timeout);
        document.querySelector('#form-preview').hidden = true;
        status.textContent = '';
      },
      onFormSubmitted: () => {
        status.textContent = 'Thank you — your registration has been received.';
      }
    });
  };
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
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { why.classList.add('is-visible'); observer.disconnect(); }
  }, { threshold: .6 });
  observer.observe(why);
} else why.classList.add('is-visible');
