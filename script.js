document.documentElement.classList.add('js');

// Menu mobile
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// Ombre de l'en-tête au défilement
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Apparition des sections
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

// Checklist des documents (mémorisée dans le navigateur)
const boxes = document.querySelectorAll('#checklist input');
const countEl = document.getElementById('docs-count');
const bar = document.getElementById('docs-bar');
document.getElementById('docs-total').textContent = boxes.length;
const KEY = 'vjimpot-checklist';
let saved = [];
try { saved = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
boxes.forEach((b, i) => { b.checked = !!saved[i]; });
const update = () => {
  const done = [...boxes].filter(b => b.checked).length;
  countEl.textContent = done;
  bar.style.width = (done / boxes.length * 100) + '%';
  try { localStorage.setItem(KEY, JSON.stringify([...boxes].map(b => b.checked))); } catch (e) {}
};
boxes.forEach(b => b.addEventListener('change', update));
update();

// Formulaire de contact -> e-mail pré-rempli
const form = document.getElementById('contact-form');
const err = document.getElementById('form-error');
form.addEventListener('submit', e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const missing = ['name', 'phone'].filter(k => !d[k].trim());
  form.querySelectorAll('input').forEach(i => i.removeAttribute('aria-invalid'));
  missing.forEach(k => form.elements[k].setAttribute('aria-invalid', 'true'));
  err.hidden = missing.length === 0;
  if (missing.length) { form.elements[missing[0]].focus(); return; }

  const body = [
    'Bonjour,',
    '',
    "Je souhaite prendre rendez-vous pour ma déclaration d'impôt.",
    '',
    'Nom : ' + d.name,
    'Téléphone : ' + d.phone,
    d.town ? 'Localité : ' + d.town : null,
    d.when ? 'Disponibilités : ' + d.when : null,
    d.message ? '\n' + d.message : null,
    '',
    'Merci et à bientôt.'
  ].filter(v => v !== null).join('\n');

  window.location.href = 'mailto:vjimpot@gmail.com'
    + '?subject=' + encodeURIComponent('Demande de rendez-vous – ' + d.name)
    + '&body=' + encodeURIComponent(body);
});

document.getElementById('year').textContent = new Date().getFullYear();
