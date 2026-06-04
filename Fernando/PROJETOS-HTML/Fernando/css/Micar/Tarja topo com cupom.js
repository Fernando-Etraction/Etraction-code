(function () {
  'use strict';

  var STYLE_ID = 'uoou-micar-banner-style';
  var BANNER_ID = 'uoou-micar-banner';
  var SWIPER_INTERVAL = null;
  var SWIPER_INDEX = 0;

  var CONFIG = {
    link: 'https://www.micarconstrucao.com.br/',
    coupon: 'MICAR5',
    strongText: 'Micar Construção',
    promoText: 'ofertas especiais para sua obra com condições imperdíveis',
    couponText: 'Use o cupom',
    expireText: 'Expira em:',
    closeStorageKey: 'uoou_micar_banner_closed'
  };

  function log() {
    console.log('[UOOU MICAR]', Array.prototype.slice.call(arguments));
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .uoou-micar-banner {
        background: #135b99;
        color: #ffffff;
        padding: 10px 5%;
        width: 100%;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1em;
        text-align: center;
        box-sizing: border-box;
        position: relative;
        transition: all 0.3s ease-in-out;
        border-bottom: 3px solid #f3c511;
        font-family: Arial, sans-serif;
      }

      .uoou-micar-banner-fixed {
        position: fixed !important;
        top: 0;
        left: 0;
      }

      .uoou-micar-text {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        max-width: 1200px;
        width: 100%;
        text-align: center;
      }

      .uoou-micar-info {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
        font-weight: 600;
        font-size: 1em;
        justify-content: center;
        color: #ffffff;
      }

      .uoou-micar-info strong {
        color: #f3c511;
      }

      .uoou-micar-coupon-wrap {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
      }

      .uoou-micar-coupon {
        background-color: #f3c511;
        color: #135b99;
        border: none;
        padding: 4px 10px;
        font-weight: 800;
        cursor: pointer;
        border-radius: 4px;
        font-size: 1em;
        transition: all 0.3s ease;
      }

      .uoou-micar-coupon:hover {
        background-color: #ffffff;
        color: #135b99;
      }

      .uoou-micar-feedback {
        color: #f3c511;
        font-weight: bold;
        font-size: 0.9em;
        display: none;
      }

      .uoou-micar-timer {
        display: flex;
        gap: 4px;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
        font-size: 0.95em;
      }

      .uoou-micar-timer-block {
        background-color: #f3c511;
        color: #135b99;
        padding: 4px 6px;
        min-width: 30px;
        text-align: center;
        border-radius: 4px;
        font-weight: bold;
        font-size: 0.95em;
        line-height: 1.2;
      }

      .uoou-micar-timer-label {
        display: block;
        font-size: 0.55em;
        color: #135b99;
        font-weight: 700;
        margin-top: 2px;
      }

      .uoou-micar-close {
        position: absolute;
        top: 6px;
        right: 10px;
        background-color: transparent;
        border: none;
        color: #ffffff;
        font-size: 1.2em;
        cursor: pointer;
      }

      .uoou-micar-close:hover {
        color: #f3c511;
      }

      @media (max-width: 480px) {
        .uoou-micar-banner {
          font-size: 0.85em;
          padding: 6px 5%;
          z-index: 2 !important;
        }

        .uoou-micar-text {
          flex-direction: column;
          gap: 4px;
        }

        .uoou-micar-info {
          justify-content: center;
          font-size: 0.9em;
          gap: 4px;
        }

        .uoou-micar-coupon-wrap {
          gap: 4px;
        }

        .uoou-micar-coupon {
          padding: 3px 8px;
          font-size: 0.9em;
        }

        .uoou-micar-timer {
          justify-content: center;
          gap: 3px;
          font-size: 0.85em;
        }

        .uoou-micar-timer-block {
          min-width: 24px;
          padding: 3px 5px;
          font-size: 0.85em;
        }

        .uoou-micar-timer-label {
          font-size: 0.5em;
        }
      }

      @media (max-width: 480px) {
        .uoou-micar-desktop {
          display: none !important;
        }

        .uoou-micar-mobile {
          display: block !important;
          padding: 10px 0;
          width: 100%;
        }
      }

      @media (min-width: 481px) {
        .uoou-micar-desktop {
          display: flex !important;
        }

        .uoou-micar-mobile {
          display: none !important;
        }
      }

      .uoou-micar-swiper {
        position: relative;
        overflow: hidden;
        width: 100%;
      }

      .uoou-micar-swiper-wrapper {
        display: flex;
        transition: transform 0.3s ease;
        width: 100%;
      }

      .uoou-micar-swiper-slide {
        flex: 0 0 100%;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 0 4px;
      }
    `;
    document.head.appendChild(style);
  }

  function buildBannerHTML() {
    return `
      <div class="uoou-micar-banner" id="${BANNER_ID}" role="region" aria-label="Oferta Micar Construção">
        <button class="uoou-micar-close" aria-label="Fechar banner" type="button">×</button>

        <div class="uoou-micar-text uoou-micar-desktop">
          <div class="uoou-micar-info">
            <span><strong>${CONFIG.strongText}</strong> | ${CONFIG.promoText} |</span>
            <span class="uoou-micar-coupon-wrap">
              <span>${CONFIG.couponText}</span>
              <button
                class="uoou-micar-coupon"
                data-coupon="${CONFIG.coupon}"
                type="button"
                aria-label="Copiar cupom ${CONFIG.coupon}"
              >
                ${CONFIG.coupon}
              </button>
            </span>
            <span>| ${CONFIG.expireText}</span>
          </div>

          <div class="uoou-micar-timer" aria-live="polite">
            <div class="uoou-micar-timer-block">
              <span class="js-uoou-horas">00</span>
              <span class="uoou-micar-timer-label">HRS</span>
            </div>
            <div class="uoou-micar-timer-block">
              <span class="js-uoou-minutos">00</span>
              <span class="uoou-micar-timer-label">MIN</span>
            </div>
            <div class="uoou-micar-timer-block">
              <span class="js-uoou-segundos">00</span>
              <span class="uoou-micar-timer-label">SEC</span>
            </div>
          </div>

          <span class="uoou-micar-feedback">Copiado!</span>
        </div>

        <div class="uoou-micar-text uoou-micar-mobile">
          <div class="uoou-micar-swiper">
            <div class="uoou-micar-swiper-wrapper">
              <div class="uoou-micar-swiper-slide">
                <div class="uoou-micar-info">
                  <span><strong>${CONFIG.strongText}</strong> |</span>
                  <span class="uoou-micar-coupon-wrap">
                    <span>${CONFIG.couponText}</span>
                    <button
                      class="uoou-micar-coupon"
                      data-coupon="${CONFIG.coupon}"
                      type="button"
                      aria-label="Copiar cupom ${CONFIG.coupon}"
                    >
                      ${CONFIG.coupon}
                    </button>
                  </span>
                </div>
              </div>

              <div class="uoou-micar-swiper-slide">
                <div class="uoou-micar-info">
                  <span>${CONFIG.expireText}</span>
                </div>
                <div class="uoou-micar-timer" aria-live="polite" style="margin-left:6px;">
                  <div class="uoou-micar-timer-block">
                    <span class="js-uoou-horas">00</span>
                    <span class="uoou-micar-timer-label">HRS</span>
                  </div>
                  <div class="uoou-micar-timer-block">
                    <span class="js-uoou-minutos">00</span>
                    <span class="uoou-micar-timer-label">MIN</span>
                  </div>
                  <div class="uoou-micar-timer-block">
                    <span class="js-uoou-segundos">00</span>
                    <span class="uoou-micar-timer-label">SEC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <span class="uoou-micar-feedback">Copiado!</span>
        </div>
      </div>
    `;
  }

  function insertBanner() {
    if (document.getElementById(BANNER_ID)) {
      log('Banner já existe');
      return;
    }

    if (localStorage.getItem(CONFIG.closeStorageKey) === 'true') {
      log('Banner já foi fechado');
      return;
    }

    var header = document.querySelector('.header-middle');
    if (header) {
      header.insertAdjacentHTML('beforebegin', buildBannerHTML());
      log('Banner inserido antes do .header-middle');
    } else {
      document.body.insertAdjacentHTML('afterbegin', buildBannerHTML());
      log('Banner inserido no topo do body');
    }
  }

  function calcularRestanteHoje() {
    var agora = new Date();
    var fim = new Date();
    fim.setHours(23, 59, 59, 999);
    return Math.max(0, fim - agora);
  }

  function atualizarCronometro() {
    var restante = calcularRestanteHoje();
    var horasEls = document.querySelectorAll('.js-uoou-horas');
    var minutosEls = document.querySelectorAll('.js-uoou-minutos');
    var segundosEls = document.querySelectorAll('.js-uoou-segundos');

    if (restante <= 0) {
      horasEls.forEach(function (el) { el.textContent = '00'; });
      minutosEls.forEach(function (el) { el.textContent = '00'; });
      segundosEls.forEach(function (el) { el.textContent = '00'; });
      return;
    }

    var horas = Math.floor((restante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutos = Math.floor((restante % (1000 * 60 * 60)) / (1000 * 60));
    var segundos = Math.floor((restante % (1000 * 60)) / 1000);

    horasEls.forEach(function (el) { el.textContent = String(horas).padStart(2, '0'); });
    minutosEls.forEach(function (el) { el.textContent = String(minutos).padStart(2, '0'); });
    segundosEls.forEach(function (el) { el.textContent = String(segundos).padStart(2, '0'); });
  }

  function startTimer() {
    atualizarCronometro();
    setInterval(atualizarCronometro, 1000);
  }

  function fadeOutAndRemove(el) {
    if (!el) return;
    el.style.transition = 'opacity 0.2s ease';
    el.style.opacity = '0';
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 200);
  }

  function bindClose() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.uoou-micar-close');
      if (!btn) return;

      var banner = document.getElementById(BANNER_ID);
      stopMobileSlider();
      fadeOutAndRemove(banner);
      localStorage.setItem(CONFIG.closeStorageKey, 'true');
    });
  }

  function bindScroll() {
    window.addEventListener('scroll', function () {
      var banner = document.getElementById(BANNER_ID);
      if (!banner) return;

      if (window.scrollY > 100) {
        banner.classList.add('uoou-micar-banner-fixed');
      } else {
        banner.classList.remove('uoou-micar-banner-fixed');
      }
    });
  }

  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    var input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }

  function showFeedback(btn) {
    var root = btn.closest('.uoou-micar-text');
    if (!root) return;

    var feedback = root.querySelector('.uoou-micar-feedback');
    if (!feedback) return;

    feedback.style.display = 'inline-block';
    feedback.style.opacity = '1';

    clearTimeout(feedback.__hideTimeout);
    feedback.__hideTimeout = setTimeout(function () {
      feedback.style.display = 'none';
    }, 1500);
  }

  function bindCouponCopy() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.uoou-micar-coupon');
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      var coupon = btn.getAttribute('data-coupon') || CONFIG.coupon;

      copyText(coupon)
        .then(function () {
          showFeedback(btn);
        })
        .catch(function () {
          showFeedback(btn);
        });
    });
  }

  function goToSlide(index) {
    var wrapper = document.querySelector('.uoou-micar-swiper-wrapper');
    if (!wrapper) return;
    wrapper.style.transform = 'translateX(-' + (index * 100) + '%)';
  }

  function startMobileSlider() {
    var isMobile = window.matchMedia('(max-width: 480px)').matches;
    var wrapper = document.querySelector('.uoou-micar-swiper-wrapper');

    if (!isMobile || !wrapper) {
      stopMobileSlider();
      return;
    }

    if (SWIPER_INTERVAL) return;

    var slides = wrapper.querySelectorAll('.uoou-micar-swiper-slide');
    if (!slides.length) return;

    SWIPER_INDEX = 0;
    goToSlide(SWIPER_INDEX);

    SWIPER_INTERVAL = setInterval(function () {
      SWIPER_INDEX = (SWIPER_INDEX + 1) % slides.length;
      goToSlide(SWIPER_INDEX);
    }, 2000);

    log('Slider mobile iniciado');
  }

  function stopMobileSlider() {
    if (SWIPER_INTERVAL) {
      clearInterval(SWIPER_INTERVAL);
      SWIPER_INTERVAL = null;
      log('Slider mobile destruído');
    }
  }

  function handleResize() {
    var resizeTimeout;

    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        stopMobileSlider();
        startMobileSlider();
      }, 120);
    });
  }

  function init() {
    injectStyle();
    insertBanner();
    startTimer();
    bindClose();
    bindScroll();
    bindCouponCopy();
    startMobileSlider();
    handleResize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();