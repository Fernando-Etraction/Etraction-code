(function () {
  "use strict";

  var BANNER_ID = "hitzz-leve3-banner";
  var STYLE_ID = "hitzz-leve3-banner-style";
  var TARGET_SELECTOR = ".container.main-container.headerOffset";
  var TARGET_PATH = "/leve-3-pague-2";

  function isTargetPage() {
    return (
      window.location.pathname
        .replace(/\/+$/, "")
        .toLowerCase() === TARGET_PATH
    );
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    var style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      #${BANNER_ID},
      #${BANNER_ID} * {
        box-sizing: border-box;
      }

      #${BANNER_ID} {
        position: relative;
        width: 100%;
        margin: 0;
        overflow: hidden;
        background: #000000;
        color: #ffffff;
        font-family: inherit;
      }

      #${BANNER_ID} .hitzz-leve3-banner__inner {
        display: flex;
        align-items: center;
        justify-content: center;
        width: min(100%, 1350px);
        min-height: 145px;
        margin: 0 auto;
        padding: 28px 35px;
        text-align: center;
      }

      #${BANNER_ID} .hitzz-leve3-banner__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        width: 100%;
        max-width: 700px;
      }

      #${BANNER_ID} .hitzz-leve3-banner__eyebrow {
        margin: 0;
        color: rgba(255, 255, 255, 0.65);
        font-size: 10px;
        font-weight: 600;
        line-height: 1;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      #${BANNER_ID} .hitzz-leve3-banner__title {
        margin: 0;
        color: #ffffff;
        font-size: clamp(28px, 3vw, 44px);
        font-weight: 400;
        line-height: 1;
        letter-spacing: -0.04em;
        text-transform: uppercase;
      }

      #${BANNER_ID} .hitzz-leve3-banner__title strong {
        font-weight: 800;
      }

      #${BANNER_ID} .hitzz-leve3-banner__text {
        margin: 0;
        color: rgba(255, 255, 255, 0.75);
        font-size: 13px;
        font-weight: 400;
        line-height: 1.45;
      }

      #${BANNER_ID} .hitzz-leve3-banner__text strong {
        color: #ffffff;
        font-weight: 700;
      }

      #${BANNER_ID} .hitzz-leve3-banner__automatic {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        margin: 2px 0 0;
        color: #ffffff;
        font-size: 11px;
        font-weight: 600;
        line-height: 1.3;
      }

      #${BANNER_ID} .hitzz-leve3-banner__automatic svg {
        flex: 0 0 auto;
        width: 14px;
        height: 14px;
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
      }

      @media (max-width: 767px) {
        #${BANNER_ID} .hitzz-leve3-banner__inner {
          min-height: 165px;
          padding: 25px 20px;
        }

        #${BANNER_ID} .hitzz-leve3-banner__content {
          gap: 6px;
        }

        #${BANNER_ID} .hitzz-leve3-banner__title {
          font-size: 32px;
        }

        #${BANNER_ID} .hitzz-leve3-banner__text {
          max-width: 320px;
          font-size: 12px;
        }

        #${BANNER_ID} .hitzz-leve3-banner__automatic {
          max-width: 320px;
          font-size: 10px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createBanner() {
    if (!isTargetPage()) {
      return false;
    }

    if (document.getElementById(BANNER_ID)) {
      return true;
    }

    var target = document.querySelector(TARGET_SELECTOR);

    if (!target || !target.parentNode) {
      return false;
    }

    injectStyles();

    var banner = document.createElement("section");

    banner.id = BANNER_ID;
    banner.setAttribute(
      "aria-label",
      "Promoção Leve 3 e Pague 2"
    );

    banner.innerHTML = `
      <div class="hitzz-leve3-banner__inner">
        <div class="hitzz-leve3-banner__content">
          <p class="hitzz-leve3-banner__eyebrow">
            Oferta especial
          </p>

          <div class="hitzz-leve3-banner__title">
            Leve 3, <strong>pague 2</strong>
          </div>

          <p class="hitzz-leve3-banner__text">
            Escolha três produtos participantes e
            <strong>pague somente por dois.</strong>
          </p>

          <p class="hitzz-leve3-banner__automatic">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 6 9 17l-5-5"></path>
            </svg>

            Desconto aplicado automaticamente no carrinho
          </p>
        </div>
      </div>
    `;

    target.parentNode.insertBefore(banner, target);

    return true;
  }

  function init() {
    if (!isTargetPage()) {
      return;
    }

    if (createBanner()) {
      return;
    }

    var attempts = 0;

    var insertionInterval = window.setInterval(function () {
      attempts += 1;

      if (createBanner() || attempts >= 40) {
        window.clearInterval(insertionInterval);
      }
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();