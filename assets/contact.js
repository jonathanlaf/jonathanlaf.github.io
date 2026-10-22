(function () {
  'use strict';
  var form = document.querySelector('.contact-form');
  var status = document.getElementById('contact-status');
  var button = form.querySelector('[type="submit"]');
  var fields = Array.from(form.querySelectorAll('input:not([type="hidden"]):not(.form-honeypot),textarea'));
  var state = '';
  var busy = false;
  var sent = false;
  var copy = {
    fr: {required:'Veuillez remplir ce champ.',email:'Entrez une adresse courriel valide.',length:'Ce texte dépasse la longueur permise.',field:'Vérifiez ce champ et réessayez.',invalid:'Veuillez corriger les champs indiqués.',sending:'Envoi en cours…',success:'Merci ! Votre message a été envoyé.',error:'L’envoi n’a pas pu être confirmé. Votre message est conservé. Réessayez ou joignez-moi par téléphone ou courriel.'},
    en: {required:'Please fill in this field.',email:'Enter a valid email address.',length:'This text is longer than permitted.',field:'Check this field and try again.',invalid:'Please correct the indicated fields.',sending:'Sending…',success:'Thank you! Your message has been sent.',error:'Sending could not be confirmed. Your message has been kept. Try again or contact me by phone or email.'}
  };
  function text(key) { return copy[document.documentElement.lang === 'en' ? 'en' : 'fr'][key]; }
  function error(field, key) {
    var message = document.getElementById(field.id + '-error');
    message.hidden = !key;
    message.textContent = key ? text(key) : '';
    field.dataset.errorKey = key || '';
    if (key) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }
  function problem(field) {
    if (field.required && !field.value.trim()) return 'required';
    if (field.type === 'email' && field.validity.typeMismatch) return 'email';
    if (field.maxLength > 0 && field.value.length > field.maxLength) return 'length';
    return '';
  }
  fields.forEach(function(field) {
    field.addEventListener('input', function() { if (field.dataset.errorKey) error(field, problem(field)); });
  });
  document.addEventListener('languagechange', function() {
    fields.forEach(function(field) { if (field.dataset.errorKey) error(field, field.dataset.errorKey); });
    if (state) status.textContent = text(state);
    form.elements._subject.value = document.documentElement.lang === 'en' ? 'Message from jonathanlafleur.ca' : 'Message depuis jonathanlafleur.ca';
  });
  form.elements._subject.value = document.documentElement.lang === 'en' ? 'Message from jonathanlafleur.ca' : 'Message depuis jonathanlafleur.ca';
  // Same public contact details as the services site, lightly obfuscated in source.
  document.querySelector('[data-contact-phone]').href = 'tel:' + atob('KzE0MTgzOTExNjIw');
  document.querySelector('[data-contact-email]').href = 'mailto:' + atob('bWVAam9uYXRoYW5sYWZsZXVyLmNh');
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    if (busy || sent) return;
    fields.forEach(function(field) { error(field, problem(field)); });
    var invalid = form.querySelector('[aria-invalid="true"]');
    if (invalid) {
      state = 'invalid'; status.textContent = text(state); invalid.focus(); return;
    }
    busy = true;
    state = 'sending'; status.textContent = text(state);
    var body = new FormData(form);
    button.disabled = true;
    fields.forEach(function(field) { field.disabled = true; });
    form.setAttribute('aria-busy', 'true');
    var controller = new AbortController();
    var timer = setTimeout(function() { controller.abort(); }, 30000);
    try {
      var response = await fetch(form.action, {method:'POST',body:body,headers:{Accept:'application/json'},signal:controller.signal});
      if (!response.ok) {
        var data = await response.json().catch(function() { return {}; });
        (Array.isArray(data.errors) ? data.errors : []).forEach(function(item) {
          var field = fields.find(function(field) { return field.name === item.field; });
          if (field) error(field, /REQUIRED/i.test(item.code || '') ? 'required' : /EMAIL/i.test(item.code || '') ? 'email' : 'field');
        });
        throw new Error('Submission not confirmed');
      }
      sent = true; state = 'success';
    } catch (error) {
      state = form.querySelector('[aria-invalid="true"]') ? 'invalid' : 'error';
    } finally {
      clearTimeout(timer); busy = false; form.removeAttribute('aria-busy');
      button.disabled = sent;
      fields.forEach(function(field) { field.disabled = sent; });
      status.textContent = text(state);
      if (sent) status.focus({preventScroll:true});
      else {
        var first = form.querySelector('[aria-invalid="true"]');
        if (first) first.focus();
      }
    }
  });
}());
