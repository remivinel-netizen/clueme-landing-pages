(function () {
  var card = document.getElementById('formulaire');
  var form = card && card.querySelector('form');
  if (!form) return;

  // Paramètres de campagne (gclid, utm_*) conservés dans la demande
  var qs = new URLSearchParams(location.search);
  ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
    if (!qs.get(k)) return;
    var i = document.createElement('input');
    i.type = 'hidden'; i.name = k; i.value = qs.get(k);
    form.appendChild(i);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    var done = function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'generate_lead', form_id: 'lp-3d-offerte', source_page: form.source_page.value });
      card.classList.add('sent');
      document.body.classList.add('lead-sent');
      card.scrollIntoView({ block: 'center' });
    };
    // À BRANCHER : renseigner data-endpoint sur <form> avec l'URL de traitement du site Clue Me.
    // Tant qu'il est vide, la page est en mode démo : rien n'est envoyé.
    var endpoint = form.dataset.endpoint;
    if (!endpoint) return done();
    fetch(endpoint, { method: 'POST', body: new FormData(form) })
      .then(function (r) { if (!r.ok) throw 0; done(); })
      .catch(function () { btn.disabled = false; alert("L'envoi a échoué. Merci de réessayer ou de nous appeler au 01 89 27 75 27."); });
  });

  // Barre d'action mobile : visible dès que le formulaire sort de l'écran
  var bar = document.querySelector('.sticky');
  if (bar && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { bar.classList.toggle('on', !en[0].isIntersecting); }, { threshold: 0 }).observe(card);
  }
  document.querySelectorAll('a[href="#formulaire"]').forEach(function (a) {
    a.addEventListener('click', function () { setTimeout(function () { var f = form.querySelector('input:not([type=hidden])'); f && f.focus({ preventScroll: true }); }, 500); });
  });
})();
