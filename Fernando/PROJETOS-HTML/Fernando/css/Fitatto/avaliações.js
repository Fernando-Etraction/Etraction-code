(function () {
  'use strict';

  var MIN = 20;
  var MAX = 50;
  var STORAGE_PREFIX = 'uoou_socialproof_views_';
  var STYLE_ID = 'uoou-socialproof-style';

  function log() {
    console.log('[UOOU JS ONLY]', ...arguments);
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .rating-info-count {
        visibility: hidden !important;
      }
      .rating-info-count.socialproof-ready {
        visibility: visible !important;
      }
    `;
    document.head.appendChild(style);
  }

  function getProductId() {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonical.href) return canonical.href;

    var titleEl = document.querySelector('.product-title');
    var title = titleEl ? titleEl.textContent.trim() : 'produto';

    return window.location.pathname + '|' + title;
  }

  function getOrCreateNumber(productId) {
    var key = STORAGE_PREFIX + productId;
    var saved = localStorage.getItem(key);

    if (saved && !isNaN(parseInt(saved, 10))) {
      return parseInt(saved, 10);
    }

    var generated = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    localStorage.setItem(key, String(generated));
    return generated;
  }

  function scrollToReviews() {
    var target = document.querySelector('.fittato-reviews-section');

    log('target reviews:', target);

    if (!target) {
      log('Não encontrou .fittato-reviews-section');
      return;
    }

    var top = target.getBoundingClientRect().top + window.pageYOffset;

    log('scroll top calculado:', top);

    window.scrollTo({
      top: top,
      behavior: 'smooth'
    });
  }

  function bindScroll(reviewLink) {
    if (!reviewLink) {
      log('Link de reviews não encontrado');
      return;
    }

    if (reviewLink.dataset.scrollBound === 'true') {
      return;
    }

    reviewLink.style.cursor = 'pointer';

    reviewLink.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') {
        e.stopImmediatePropagation();
      }

      log('Clique no link de reviews detectado');
      scrollToReviews();

      return false;
    }, true);

    reviewLink.dataset.scrollBound = 'true';
    log('Scroll bindado com sucesso');
  }

  function apply() {
    var ratingCount = document.querySelector('.rating-info-count');
    var reviewLink = document.querySelector('.scrollto.seeReviews.rating-link.see-review');

    log('ratingCount:', ratingCount);
    log('reviewLink:', reviewLink);

    if (!ratingCount) return false;

    var number = getOrCreateNumber(getProductId());

    ratingCount.innerHTML = ' - Mais de <span class="rating-info-number">' + number + '</span> avaliações';
    ratingCount.classList.add('socialproof-ready');
    ratingCount.dataset.socialproofApplied = 'true';

    bindScroll(reviewLink);

    return true;
  }

  function boot() {
    injectStyle();

    if (apply()) return;

    var tries = 0;
    var maxTries = 30;

    function tryApply() {
      tries++;

      if (apply()) {
        log('Aplicado na tentativa:', tries);
        return;
      }

      if (tries < maxTries) {
        requestAnimationFrame(tryApply);
      } else {
        log('Elemento não encontrado após', tries, 'tentativas');
      }
    }

    requestAnimationFrame(tryApply);
  }

  boot();
})();