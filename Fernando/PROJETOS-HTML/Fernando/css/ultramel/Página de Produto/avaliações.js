(function () {
  // CSS
  if (!document.getElementById('etr-rating-score-css')) {
    var css = document.createElement('style');
    css.id = 'etr-rating-score-css';
    css.textContent =
      '.rating-info-count{display:inline-flex;align-items:center;gap:4px}' +
      '.rating-info-score{font-weight:700}' +
      '.rating-info-sep{opacity:.6;margin:0 2px}';
    document.head.appendChild(css);
  }

  function aplicarNota() {
    var links = document.querySelectorAll('.rating-link-see-review');
    for (var l = 0; l < links.length; l++) {
      var link = links[l];
      if (link.getAttribute('data-nota-ok')) continue;

      var count = link.querySelector('.rating-info-count');
      var stars = link.querySelectorAll('.rating-stars i');
      if (!count || !stars.length) continue;

      var nota = 0;
      for (var s = 0; s < stars.length; s++) {
        var c = stars[s].classList;
        if (c.contains('fa-star-half-o') || c.contains('fa-star-half') || c.contains('fa-star-half-empty')) {
          nota += 0.5;
        } else if (c.contains('fa-star')) {
          nota += 1;
        }
      }

      var notaTxt = (nota % 1 === 0 ? nota : nota.toFixed(1).replace('.', ',')) + '/5';

      var score = document.createElement('span');
      score.className = 'rating-info-score';
      score.textContent = notaTxt;

      var sep = document.createElement('span');
      sep.className = 'rating-info-sep';
      sep.textContent = '·';

      count.insertBefore(sep, count.firstChild);
      count.insertBefore(score, sep);

      link.setAttribute('data-nota-ok', '1');
    }
  }

  function iniciar() {
    aplicarNota();
    new MutationObserver(aplicarNota).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();