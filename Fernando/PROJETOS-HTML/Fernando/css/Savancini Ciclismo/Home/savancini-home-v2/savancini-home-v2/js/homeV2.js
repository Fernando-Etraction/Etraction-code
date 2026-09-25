/*
  Savancini Home V2 - JS de sobrescrita
  - Corrige hrefs quebrados do menu.
  - Move stories e avaliacoes originais para a nova hierarquia.
  - Clona cards das prateleiras atuais para as novas vitrines.
  - Oculta os blocos originais de banners/prateleiras/newsletter/SEO/avaliacoes.
*/
(function () {
  'use strict';

  var SELECTORS = {
    homeRoot: '.container-landing-page',
    v2: '#sv-home-v2',
    header: '.ra-header.header-21.header-fixed',
    originalRow: '.container-landing-page > .container-row',
    productCard: '.container-landing-page > .container-row .product-list-react .swiper-slide',
    stories: '.stories-video-planweb-carousel'
  };

  var ROWS_TO_HIDE_BY_DEFAULT = 13; // slots 1-13: banners, stories, prateleiras, newsletter, SEO e avaliacoes.
  var sourceCards = [];

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function getHref(anchor) {
    if (!anchor) return '';
    return anchor.getAttribute('href') || '';
  }

  function setHref(anchor, href) {
    if (!anchor || !href) return;
    anchor.setAttribute('href', href);
  }

  function fixBrokenMenuLinks() {
    var links = Array.prototype.slice.call(document.querySelectorAll('a[href]'));

    links.forEach(function (link) {
      var href = getHref(link).replace(window.location.origin, '');
      var label = normalize(link.textContent);

      if (href === '/acessorios' || href.endsWith('/acessorios')) {
        setHref(link, '/acessorios-para-ciclismo');
        link.setAttribute('data-sv-fixed-link', 'acessorios');
      }

      if (href === '/combos' || href.endsWith('/combos')) {
        var nextHref = label.indexOf('masculino') > -1 ? '/combos-ciclismo-masculino' : '/combos-femininos';
        setHref(link, nextHref);
        link.setAttribute('data-sv-fixed-link', 'combos');
      }
    });
  }

  function collectProductCards(v2) {
    var cards = Array.prototype.slice.call(document.querySelectorAll(SELECTORS.productCard));
    var seen = Object.create(null);

    return cards.filter(function (card) {
      if (v2 && v2.contains(card)) return false;
      var anchor = card.querySelector('a[href]');
      var href = getHref(anchor);
      var key = href || normalize(card.textContent);
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function getCardMeta(card) {
    var txt = normalize(card.textContent);
    var href = normalize(getHref(card.querySelector('a[href]')));
    return {
      text: txt,
      href: href,
      isFeminino: /feminino|macaquinho|macacao|calca/.test(txt + ' ' + href),
      isMasculino: /masculino|bretelle|bermuda|camisa masculina|fit pro/.test(txt + ' ' + href),
      isCombo: /combo|2 por|2 macaquinhos|bretelle \+|camisa \+|por 298/.test(txt + ' ' + href),
      isAccessory: /bandana|meia|luva|faixa|manguito|pernito|acessorio/.test(txt + ' ' + href),
      hasDiscount: /off|%|sale|promocao|de r\$/.test(txt)
    };
  }

  function filterCards(cards, filter) {
    if (!filter || filter === 'all') return cards;

    return cards.filter(function (card) {
      var meta = getCardMeta(card);
      if (filter === 'feminino') return meta.isFeminino;
      if (filter === 'masculino') return meta.isMasculino;
      if (filter === 'combo') return meta.isCombo;
      if (filter === 'accessory') return meta.isAccessory;
      if (filter === 'promo') return meta.hasDiscount;
      return true;
    });
  }

  function prepareCardClone(card) {
    var clone = card.cloneNode(true);
    var anchor = clone.querySelector('a[href]');

    clone.removeAttribute('style');
    clone.classList.add('sv-product-card');
    clone.classList.remove('swiper-slide-active', 'swiper-slide-next', 'swiper-slide-prev');

    if (anchor) {
      anchor.classList.add('sv-product-link');
      anchor.setAttribute('data-sv-action', 'product-click');

      if (!anchor.querySelector('.sv-card-cta')) {
        var cta = document.createElement('span');
        cta.className = 'sv-card-cta';
        cta.textContent = 'Ver produto';
        anchor.appendChild(cta);
      }
    }

    return clone;
  }

  function renderRail(targetName, cards, maxItems) {
    var mount = document.querySelector('[data-sv-rail-target="' + targetName + '"]');
    var empty = document.querySelector('[data-sv-empty="' + targetName + '"]');
    if (!mount) return;

    var selectedCards = (cards || []).slice(0, maxItems || 8);
    mount.innerHTML = '';

    selectedCards.forEach(function (card) {
      mount.appendChild(prepareCardClone(card));
    });

    if (empty) {
      empty.classList.toggle('is-visible', selectedCards.length === 0);
    }
  }

  function hydrateProductRails() {
    var promoCards = filterCards(sourceCards, 'promo');
    var comboCards = filterCards(sourceCards, 'combo');

    renderRail('best-sellers', sourceCards, 8);
    renderRail('promo-products', promoCards.length ? promoCards : sourceCards, 8);

    // Caso seja criado um trilho futuro com data-sv-rail-target="combos-products".
    renderRail('combos-products', comboCards, 6);
  }

  function initTabs() {
    var section = document.querySelector('[data-sv-section="best-sellers"]');
    if (!section) return;

    var buttons = Array.prototype.slice.call(section.querySelectorAll('[data-sv-filter]'));
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-sv-filter');
        var filtered = filterCards(sourceCards, filter);
        var cardsToRender = filtered.length ? filtered : sourceCards;

        buttons.forEach(function (btn) { btn.classList.remove('is-active'); });
        button.classList.add('is-active');
        renderRail('best-sellers', cardsToRender, 8);
      });
    });
  }

  function moveStories() {
    var mount = document.getElementById('sv-stories-mount');
    var stories = document.querySelector(SELECTORS.stories);
    if (!mount || !stories || mount.contains(stories)) return;

    mount.innerHTML = '';
    mount.appendChild(stories);
    stories.classList.add('sv-stories-mounted');
  }

  function moveReviews() {
    var mount = document.getElementById('sv-reviews-mount');
    if (!mount) return;

    var headings = Array.prototype.slice.call(document.querySelectorAll('.container-landing-page .container-row h2, .container-landing-page .container-row .bg-title'));
    var reviewHeading = headings.find(function (heading) {
      return normalize(heading.textContent).indexOf('avaliacoes dos clientes') > -1;
    });

    if (!reviewHeading) return;

    var row = reviewHeading.closest('.container-row');
    if (!row || mount.contains(row)) return;

    mount.innerHTML = '';
    while (row.firstChild) {
      mount.appendChild(row.firstChild);
    }
  }

  function hideOriginalRows(homeRoot, v2) {
    var v2Row = v2 ? v2.closest('.container-row') : null;
    var rows = Array.prototype.slice.call(document.querySelectorAll(SELECTORS.originalRow));

    rows.forEach(function (row, index) {
      if (row === v2Row || (v2 && v2.contains(row))) return;
      row.setAttribute('data-sv-original-row', String(index + 1));

      if (index < ROWS_TO_HIDE_BY_DEFAULT) {
        row.classList.add('sv-original-hidden');
      }
    });
  }

  function initNewsletterTracking() {
    var form = document.querySelector('.sv-newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function () {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'sv_home_v2_newsletter_submit',
          section: 'newsletter'
        });
      }
    });
  }

  function initClickTracking(v2) {
    if (!v2) return;

    v2.addEventListener('click', function (event) {
      var target = event.target.closest('a, button');
      if (!target) return;

      var section = target.closest('[data-sv-section]');
      var payload = {
        event: 'sv_home_v2_click',
        section: section ? section.getAttribute('data-sv-section') : 'unknown',
        label: normalize(target.textContent).slice(0, 80),
        href: target.getAttribute('href') || ''
      };

      if (window.dataLayer) {
        window.dataLayer.push(payload);
      }
    });
  }

  function refreshMovedCarousels() {
    // Mantem carousels Swiper mais estaveis apos mover DOM.
    window.dispatchEvent(new Event('resize'));

    if (window.Swiper && Array.isArray(window.swipers)) {
      window.swipers.forEach(function (swiper) {
        if (swiper && typeof swiper.update === 'function') swiper.update();
      });
    }
  }

  ready(function () {
    var homeRoot = document.querySelector(SELECTORS.homeRoot);
    var v2 = document.querySelector(SELECTORS.v2);

    if (!homeRoot || !v2) return;

    document.body.classList.add('sv-home-v2-ready');

    fixBrokenMenuLinks();
    sourceCards = collectProductCards(v2);
    hydrateProductRails();
    initTabs();
    moveStories();
    moveReviews();
    hideOriginalRows(homeRoot, v2);
    initNewsletterTracking();
    initClickTracking(v2);

    setTimeout(refreshMovedCarousels, 350);
  });
}());
