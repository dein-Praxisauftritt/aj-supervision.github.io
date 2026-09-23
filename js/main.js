// AJ Supervision – main.js

// Mobile nav toggle
const burger = document.querySelector('.burger');
const nav    = document.querySelector('.nav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// Active nav link
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === page || (page === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Formspree AJAX submit
const form = document.getElementById('contact-form');
if (form) {
  // Spamschutz: Zeitstempel beim Laden setzen. Bots senden sofort ab,
  // Menschen brauchen zum Ausfuellen laenger als ein paar Sekunden.
  const ts = document.getElementById('form-ts');
  const loadedAt = Date.now();
  if (ts) { ts.value = String(loadedAt); }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const success = document.getElementById('form-success');

    // Honigtopf-Felder: ausgefuellt = Bot. Wir tun so, als waere alles gut.
    const trap = form.querySelector('[name="_gotcha"]');
    const trap2 = form.querySelector('[name="website"]');
    const tooFast = (Date.now() - loadedAt) < 3000;
    const noToken = !ts || !ts.value;
    if ((trap && trap.value) || (trap2 && trap2.value) || tooFast || noToken) {
      form.reset();
      if (ts) { ts.value = String(loadedAt); }
      if (success) { success.style.display = 'block'; }
      btn.disabled = true;
      btn.textContent = 'Gesendet ✓';
      return;
    }

    // Pflichtfelder pruefen (das Formular hat novalidate)
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Wird gesendet…';
    try {
      // Hilfsfelder des Spamschutzes gehoeren nicht in die Mail
      const daten = new FormData(form);
      daten.delete('_ts');
      daten.delete('website');
      const res = await fetch(form.action, {
        method: 'POST',
        body: daten,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        if (success) { success.style.display = 'block'; }
        btn.textContent = 'Gesendet ✓';
      } else {
        btn.disabled = false;
        btn.textContent = 'Nachricht senden';
        alert('Leider ist ein Fehler aufgetreten. Bitte schreiben Sie direkt an kontakt@aj-supervision.de');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Nachricht senden';
      alert('Leider ist ein Fehler aufgetreten. Bitte schreiben Sie direkt an kontakt@aj-supervision.de');
    }
  });
}
